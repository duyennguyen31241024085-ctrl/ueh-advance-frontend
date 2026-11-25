function readStore(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function normalizeSearch(text) {
    return text.toLocaleLowerCase('vi').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd');
}

function addProduct(id, qty, variant, warranty = 12) {
    const product = products[id];
    if (!product || !Number.isInteger(qty) || qty < 1) return false;
    const cart = readStore('ueh_cart');
    const alreadyAdded = cart.reduce((sum, item) =>
        item.name === product.name ? sum + Number(item.qty) : sum, 0);
    if (alreadyAdded + qty > 100 - product.stock) return false;

    const choice = variant || product.variant;
    const price = product.price + (warranty === 24 ? 300000 : 0);
    const label = warranty === 24 ? choice + ' - BH 24 Tháng' : choice;
    const existing = cart.find(item =>
        item.name === product.name && item.variant === label && item.price === price);
    if (existing) {
        existing.qty = Number(existing.qty) + qty;
        existing.img = product.img;
    } else {
        cart.push({name: product.name, price, img: product.img, variant: label, qty});
    }
    localStorage.setItem('ueh_cart', JSON.stringify(cart));
    return true;
}
