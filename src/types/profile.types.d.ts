export interface ProfileBody {
    name: string
    balance: number
}

export interface TransacYourMoneyBody {
    id: number
    amount: number
}

export interface CreateTransaction {
    amount: number
    sender_id?: number
    receiver_id?: number
    type: 'deposit' | 'withdrawal' | 'transfer'
}

export interface SendMoney {
    amount: number
    sender_id: number
    receiver_id: number
}