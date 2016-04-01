var yesPleItems = [
  {
    title: "Electronics",
    content: "Smartphones, tablets, laptops."
  },
  {
    title: "New or like-new designer clothing, shoes and bags",
    content: "<a href>See full list of eligible brands and estimated values</a>"
  },
  {
    title: "Antiques and collectibles",
    content: "Early issues of comics, rare baseball cards, vintage toys"
  },
  {
    title: "High-end kitchen appliances",
    content: "Blenders, mixers, juicers — brands like KitchenAid, Vitamix, and Breville"
  },
  {
    title: "Sporting goods",
    content: "Golf clubs, camping gear"
  },
  {
    title: "Musical instruments",
    content: "Guitars, trumpets, violins"
  },
];

var noThanItems = [
  {
    title: "Items in poor condition, items worth less than $40",
    content: "Nothing torn, stained, broken, smelly, not working"
  },
  {
    title: "Bulky items, items heavier than 25 lbs",
    content: "Surfboards, furniture, large garden equipment"
  },
  {
    title: "Breakable items",
    content: "Vases, china, and fragile collectibles"
  },
  {
    title: "Media",
    content: "DVDs, CDs, magazines, books. (But box sets and collectibles are OK)"
  },
  {
    title: "Items that can't be verified or require a license or code",
    content: "Gift cards, prepaid phones, coupons, subscriptions, software, computer games"
  },
  {
    title: "eBay-prohibited items",
    content: "Weapons, counterfeit items, alcohol, tobacco, drugs"
  },
  {
    title: "High-value items that require authentication",
    content: "Watches, jewelry, art"
  }
];

Template.whatCanISell.helpers({
  yesPleItems: yesPleItems,
  noThanItems: noThanItems
});
