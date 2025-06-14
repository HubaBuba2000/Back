import db from '../db.js';
export class ProfileController {
    constructor() {
        this.withdrawalMoney = this.withdrawalMoney.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
        this.checkId = this.checkId.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.getProfileById = this.getProfileById.bind(this);
        this.depositMoney = this.depositMoney.bind(this);
        this.sendMoney = this.sendMoney.bind(this);
        this.showTransactions = this.showTransactions.bind(this);
    }
    checkId(id) {
        if (!id || typeof id != 'number') {
            return false;
        }
        return true;
    }
    checkUser(user) {
        return user.rows.length != 0;
    }
    async createTransaction({ receiver_id = 0, sender_id = 0, amount, type }) {
        try {
            const transaction = await db.query('INSERT INTO transaction (amount, sender_id, receiver_id, type) values ($1, $2, $3, $4) RETURNING *', [amount, sender_id, receiver_id, type]);
            return transaction;
        }
        catch (error) {
            console.error(error);
        }
    }
    async createProfile(req, res) {
        try {
            const { name, balance = 0.0 } = req.body;
            const newProfile = await db.query('INSERT INTO profile (name, balance) values ($1, $2) RETURNING *', [name, balance]);
            res.json(newProfile.rows[0]);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async getProfileById(req, res) {
        try {
            const profileId = Number(req.params.id);
            if (!(this.checkId(profileId))) {
                res.status(400).json({ error: 'Неверный Id' });
                return;
            }
            const profile = await db.query('SELECT * FROM profile WHERE id = $1', [profileId]);
            if (!(this.checkUser(profile))) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            res.json(profile.rows[0]);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async showTransactions(req, res) {
        try {
            const profileId = Number(req.params.id);
            if (!(this.checkId(profileId))) {
                res.status(400).json({ error: 'Неверный Id' });
                return;
            }
            const transactions = await db.query('SELECT * FROM transaction WHERE sender_id = $1 OR receiver_id = $1', [profileId]);
            res.json(transactions.rows);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async withdrawalMoney(req, res) {
        try {
            const { id, amount } = req.body;
            if (!(this.checkId(id))) {
                res.status(400).json({ error: 'Неверный Id' });
                return;
            }
            const profile = await db.query('SELECT * FROM profile WHERE id = $1', [id]);
            const currentBalance = profile.rows[0].balance;
            if (!(this.checkUser(profile))) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            if (amount > currentBalance) {
                res.status(400).json({ error: 'Недостаточно средств' });
                return;
            }
            await db.query('UPDATE profile set balance = $1 WHERE id = $2 RETURNING *', [currentBalance - amount, id]);
            debugger;
            const transaction = await this.createTransaction({
                sender_id: id,
                receiver_id: id,
                amount: amount,
                type: 'withdrawal'
            });
            res.json(transaction?.rows[0]);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async depositMoney(req, res) {
        try {
            debugger;
            const { id, amount } = req.body;
            if (!(this.checkId(id))) {
                res.status(400).json({ error: 'Неверный Id' });
                return;
            }
            const profile = await db.query('SELECT * FROM profile WHERE id = $1', [id]);
            const currentBalance = profile.rows[0].balance;
            if (!(this.checkUser(profile))) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            await db.query('UPDATE profile set balance = $1 WHERE id = $2 RETURNING *', [currentBalance + amount, id]);
            const transaction = await this.createTransaction({
                sender_id: id,
                receiver_id: id,
                amount: amount,
                type: 'deposit'
            });
            res.json(transaction?.rows[0]);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async sendMoney(req, res) {
        try {
            debugger;
            const { receiver_id, sender_id, amount } = req.body;
            if (!(this.checkId(receiver_id)) || !(this.checkId(sender_id))) {
                res.status(400).json({ error: 'Неверный Id' });
                return;
            }
            const sender_profile = await db.query('SELECT * FROM profile WHERE id = $1', [sender_id]);
            const receiver_profile = await db.query('SELECT * FROM profile WHERE id = $1', [receiver_id]);
            const currentSenderBalance = sender_profile.rows[0].balance;
            const currentReceiverBalance = receiver_profile.rows[0].balance;
            if (!(this.checkUser(sender_profile)) || !(this.checkUser(sender_profile))) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            await db.query('UPDATE profile set balance = $1 WHERE id = $2 RETURNING *', [currentSenderBalance - amount, sender_id]);
            await db.query('UPDATE profile set balance = $1 WHERE id = $2 RETURNING *', [currentReceiverBalance + amount, receiver_id]);
            const transaction = await this.createTransaction({
                sender_id,
                receiver_id,
                amount,
                type: 'transfer'
            });
            res.json(transaction?.rows[0]);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}
export default new ProfileController();
