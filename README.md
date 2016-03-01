# peach-pay
NodeJS Module for PeachPayment

#### Init
```
gateway = new peach(
{
    production: false,
    userId: {PEACH_USER_ID},
    password: {PEACH_PASSWORD},
    entityId: {PEACH_ENTITY_ID}
});
```

#### Use
* Creating a card  
```
gateway.card.create({
    'name': "John Smith",
    'paymentBrand': "VISA",
    'ccNumber': "xxxxxxxxxxxxxxxx",
    'cardExpMonth': "01",
    'ccExpYear': "2015",
    'ccCVV': "xxx"
})
```

* Creating a transaction  
```
gateway.transaction.create({
	paymentId: {CARD_ID},
	amount: 10
})
```

* Refunding a transaction  
```
gateway.transaction.refund({
	transactionId: {TRANSACTION_ID},
	amount: 10
})
```