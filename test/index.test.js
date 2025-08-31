function sum(a, b){
    return a+b;
}

test('adds 1+2 to equal 3', () => {
  let ans = sum(1, 2);
  expect(ans).toBe(3);
})
