class SuitePack {
    constructor(description, startFile, callback) {
        this.description = description;
        this.startFile = startFile;
        this.callback = callback;
    }

    run() {
        this.callback();
    }
}

const gildedRoseTestFlow = function() {
    let { Shop, createItem, Item } = require(this.startFile);

    if (!createItem)
        createItem = function (name, sellIn, quality) {
            return new Item(...arguments);
        }

    const gildedRose = new Shop();
    const fastForward = (function (count = 1) {
        for (let i = 0; i < count; i++)
            this.updateQuality();
    }).bind(gildedRose);
    
    describe(this.description, function () {
        it("Default case: should foo", function () {
            gildedRose.items = [createItem("foo", 10, 10)];
            
            expect(gildedRose.items[0].name).toBe("foo");
            expect(gildedRose.items[0].sellIn).toBe(10);
            expect(gildedRose.items[0].quality).toBe(10);
        });
        it("Normal item quality degrades as they approach their sell date", function () {
            gildedRose.items = [createItem("normal item", 10, 50)];
    
            fastForward(15);
    
            expect(gildedRose.items[0].sellIn).toBe(-5);
            expect(gildedRose.items[0].quality).toBe(30);
        })
        it("Aged Brie increases in quality the older it gets", function () {
            gildedRose.items = [createItem("Aged Brie", 3, 5)];
    
            fastForward(10);
    
            expect(gildedRose.items[0].sellIn).toBe(-7);
            expect(gildedRose.items[0].quality).toBe(22);
        })
        it("Backstage passes quality increases rapidly as sell date gets closer", function () {
            gildedRose.items = [createItem("Backstage passes to a TAFKAL80ETC concert", 7, 5)];
    
            fastForward(3);

            expect(gildedRose.items[0].sellIn).toBe(4);
            expect(gildedRose.items[0].quality).toBe(12);
        })
        it ("Backstage passes quality drop to 0 after the concert", function() {
            gildedRose.items = [createItem("Backstage passes to a TAFKAL80ETC concert", 5, 5)];

            fastForward(6)

            expect(gildedRose.items[0].sellIn).toBe(-1);
            expect(gildedRose.items[0].quality).toBe(0);
        })
        it("sulfuras is eternal", function() {
            gildedRose.items = [createItem("Sulfuras, Hand of Ragnaros", 3, 80)];

            fastForward(100);

            expect(gildedRose.items[0].sellIn).toBe(3);
            expect(gildedRose.items[0].quality).toBe(80);
        })
    });
}

const ori = new SuitePack("Gilded Rose (original)", "../src/gilded_rose", gildedRoseTestFlow);
ori.run();

const refactored = new SuitePack("Gilded Rose (refactored)", "../src/gilded_rose.refactored", gildedRoseTestFlow);
refactored.run()
