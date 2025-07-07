const randomNum = () => {
    return Math.floor(Math.random() * 256);
}

const colorGenerator = () => {
    const color = `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
    return color;
}

module.exports =  colorGenerator;