class Item {
    name;
    sellIn;
    quality;
    
    _reduceSellIn(value = 1) {
        this.sellIn -= value;
    }

    _addQuality(value = 1) {
        if (this.quality < 50)
            this.quality = Math.min(50, this.quality + value);
    }
    _reduceQuality(value = 1) {
        if (this.quality > 0)
            this.quality = Math.max(0, this.quality - value);
    }
    _resetQuality() {
        this.quality = 0;
    }

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    updateQuality() {
        this._updateBeforeExpiration();

        this._reduceSellIn();

        if (this.sellIn < 0) 
            this._updateAfterExpiration();
    }
    
    _updateBeforeExpiration() {
        throw new Error("Must override");
    }
    
    _updateAfterExpiration() {
        throw new Error("Must override");
    }
}

class GenericItem extends Item {
    _updateBeforeExpiration() {
        this._reduceQuality();
    }
    _updateAfterExpiration() {
        this._reduceQuality();
    }
}

class AgedBrie extends Item {
    _updateBeforeExpiration() {
        this._addQuality();
    }
    _updateAfterExpiration() {
        this._addQuality();
    }
}

class Backstage extends Item {
    updateQuality() {
        this._addQuality();

        if (this.sellIn < 11) {
            this._addQuality();
        }
        if (this.sellIn < 6) {
            this._addQuality();
        }

        this._reduceSellIn();

        if (this.sellIn < 0) 
            this._resetQuality();
    }
}

class Sulfuras extends Item {
    updateQuality() {
    }
}


class Shop {
    constructor(items = []) {
        this.items = items;
    }
    
    updateQuality() {
        for (let item of this.items)
            item.updateQuality();
        
        return this.items;
    }
}
const typeRegistry = {
    'Aged Brie': AgedBrie,
    'Backstage passes to a TAFKAL80ETC concert': Backstage,
    'Sulfuras, Hand of Ragnaros': Sulfuras,
}

function createItem(name, sellIn, quality) {
    let Type = typeRegistry[name] ?? GenericItem;

    return new Type(...arguments); 
}

module.exports = {
    createItem,
    Shop
}
