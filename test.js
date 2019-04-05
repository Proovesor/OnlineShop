const noisy = f => {
    return (...args) => {
        console.log(`Calling with: `, args);
        let result = f(...args);
        console.log(`Called with: `, args, `returned: `, result);
        return result
    }
}

noisy(Math.max)(5, 4, 3);


const repeat = (n, action) => {
    for (let index = 0; index < n; index++) {
        action(index); 
    }
}

const unless = (test, then) => {
    if (!test)
        then();
}

repeat(5, n => {
    unless(n % 2 === 1, () => {
        console.log(n, `is even`);       
    })
})

const reduce = (array, combine, start) => {
    let current = start;
    for (let element of array) {
        current = combine(current, element);
    }
    return current
}

console.log(reduce([5, 4, 3, 2, 1], (a, b) => a + b, 5));


class Temperature {
    constructor(celsius) {
        this.celsius = celsius;
    }

    get fahrenheit () {
        return this.celsius * 1.8 + 32
    }

    set fahrenheit(value) {
        this.celsius = (value - 32) / 1.8
    }

    static fromFahrenheit(value) {
        return new Temperature((value - 32) / 1.8)
    }

}

let temp = new Temperature(25);

console.log(temp.fahrenheit, temp);

temp.fahrenheit = 100;

console.log(temp.celsius);

console.log(temp.fromFahrenheit = 100);





