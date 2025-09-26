class VendingMachine {

    constructor() {
        this.denoms = [500, 200, 100, 50, 20, 10, 5, 2, 1];
        this.products = [
            {
                id: 1, name: 'Soda', price: 120,
            }
        ]
        this.selectedProduct = null;
        this.balance = 0;
    }      

    restockProduct(newProduct) {
        const isOccupied = this.products.find(p => p.id === newProduct.id);
        if (isOccupied) {
            return {
                ok: false,
                message : 'Product with the same id already exists'
            }
        }
        this.products.push(newProduct);
        return {
            ok: true,
            message: 'Products restocked successfully'
        }
    }

    selectProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            return {
                ok: false,
                message: 'Product not found'
            }
        }   
        this.selectedProduct = product;
        return {
            ok: true,
            message: `Product ${product.name} selected. Please insert ${product.price} rupees.`
        }
    }

    insertBills(amount) {

        if(!Number.isInteger(amount) || amount <= 0) {
            return {
                ok: false,
                message: 'Please insert a valid amount'
            }
        }

        if (!this.denoms.includes(amount)) {
            return {
                ok: false,
                message: 'Invalid denomination. Please insert valid bills/coins.'
            }
        } 

        this.balance += amount;

        if(this.selectedProduct.price > this.balance) {
            return {
                ok: true,
                message: `Inserted ${amount} rupees for ${this.selectedProduct.name}. Please insert ${this.selectedProduct.price - this.balance} more rupees.`
            }
        }  

        return this.dispenseProduct(this.selectedProduct);
    }

    dispenseProduct(product) {
        this.products = this.products.filter(p => p.id !== product.id);
        const noteToReturn = this.returnChange();
        return {
            ok: true,
            message: noteToReturn.length === 0 ? `Product ${product.name} has been dispensed.` : `Product ${product.name} has been dispensed, Please collect your change: ${noteToReturn.join(', ')}`
        }
    }

    returnChange() {
        let remainingBalance = this.balance - this.selectedProduct.price;
        const coins = [];

        for (let note of this.denoms) {
            while(remainingBalance >= note){
                coins.push(note);
                remainingBalance -= note;
            }
        }
        return coins;
    }
}


const vm = new VendingMachine();
vm.restockProduct({id: 2, name: 'Water', price: 20});

const productResult = vm.selectProduct(3);

if(!productResult.ok) {
    console.log(productResult.message);
    process.exit(1);
}

//vm.insertBills(50);
const message = vm.insertBills(100);

console.log(message);


