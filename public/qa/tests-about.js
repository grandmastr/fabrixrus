suite('"Tests" about page test',() => {
    test('Unbroken Link', () => {
        assert($('a[href="/contact"]').length);
    });
});