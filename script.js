const button = document.getElementById('click-button')
const count = document.getElementById('click-count')
const shopContainer = document.getElementById('shop-items')
const statsContainer = document.getElementById('stats-panel')
let itemsOwned = []
let totalClickCount = 0
let multiplierCount
const shopItems = [
  {
    name: 'Daycare Workers',
    canStack: true,
    description: 'Daycare workers will pat the pichu!',
    imagePath: 'public/daycare.webp',
    cost: 10,
    startingCost: 10,
  },
  {
    name: 'Lucky Egg',
    canStack: true,
    multiplier: 1.15,
    description: 'A Lucky Egg! Increases daycare workers efficiency by 15%',
    imagePath: 'public/luckyegg.png',
    cost: 250,
    startingCost: 250,
  },
  {
    name: 'Poké ball',
    canStack: true,
    multiplier: 1.1,
    description: 'A standart poké ball! Multiplies the value of each click by 10%',
    imagePath: 'public/pokeball.png',
    cost: 15,
    startingCost: 15,
  },
  {
    name: 'Great Ball',
    canStack: true,
    multiplier: 1.2,
    description: 'A great ball! Multiplies the value of each click by 20%',
    imagePath: 'public/greatball.png',
    cost: 150,
    startingCost: 150,
  },
  {
    name: 'Ultra Ball',
    canStack: true,
    multiplier: 1.3,
    description: 'A ultra ball! Multiplies the value of each click by 30%',
    imagePath: 'public/ultraball.png',
    cost: 500,
    startingCost: 500,
  },
  {
    name: 'Master Ball',
    canStack: true,
    multiplier: 2,
    description: 'A Master ball! Multiplies the value of each click by 100%',
    imagePath: 'public/masterball.png',
    cost: 5000,
    startingCost: 5000,
  },
  {
    name: 'Oran Berry',
    canStack: false,
    description: 'An Oran berry for the pichu! Increases the click value by 7% (one time only)',
    multiplier: 1.07,
    imagePath: 'public/oranberry.png',
    cost: 1000,
    startingCost: 1000,
  },
  {
    name: 'Razz Berry',
    canStack: false,
    description: 'An Razz berry for the pichu! Increases the click value by 11% (one time only)',
    multiplier: 1.11,
    imagePath: 'public/razzberry.png',
    cost: 2500,
    startingCost: 2500,
  },
  {
    name: 'Sitrus Berry',
    canStack: false,
    description: 'An Sitrus berry for the pichu! Increases the click value by 15% (one time only)',
    multiplier: 1.15,
    imagePath: 'public/sitrusberry.png',
    cost: 5000,
    startingCost: 5000,
  },
  {
    name: 'Nanab Berry',
    canStack: false,
    description: 'An Nanab berry for the pichu! Increases the click value by 25% (one time only)',
    multiplier: 1.25,
    imagePath: 'public/nanabberry.png',
    cost: 10000,
    startingCost: 10000,
  },
]

function buttonClick(luckyEgg) {
  console.log('Button was clicked!')

  const multiplierOwned = itemsOwned
    .filter((item) => item.multiplier && item.name !== 'Lucky egg')
    .reduce((total, current) => {
      return total * current.multiplier ** current.amount
    }, 1)

  multiplierCount = multiplierOwned ?? 1

  if (luckyEgg) {
    multiplierCount * luckyEgg.amount ** luckyEgg.multiplier
  }

  // This adds two decimal houses in the number,
  // Then the number is rounded and then removes the two decimal houses from earlier,
  // Creating a somewhat consistent two decimal housed number
  // (It breaks for a split second when the user buys a item)
  totalClickCount = Math.round((totalClickCount + 1 * multiplierCount) * 100) / 100

  count.textContent = totalClickCount
  createStats()
}

button.addEventListener('click', () => {
  buttonClick()
})

function createShopItems() {
  // remove all items already in the shop
  document.querySelectorAll('.shop-item').forEach((element) => {
    element.remove()
  })

  // add new items
  // and ignore consumables if they were already bought
  shopItems.forEach((item) => {
    if (!item.canStack && itemsOwned.find((ownedItem) => item.name === ownedItem.name)) {
      return
    }
    const shopItem = document.createElement('div')
    shopItem.className = 'shop-item'

    shopItem.innerHTML = `
      <div>
        <image src="${item.imagePath}" width=56 alt="${item.name} illustration"/>
      </div>
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <button onclick="buyItem('${item.name}')">
        ${item.cost} pats
      </button>
    `
    shopContainer.appendChild(shopItem)
  })
}

function buyItem(itemName) {
  const item = shopItems.find((i) => i.name === itemName)
  if (totalClickCount >= item.cost) {
    totalClickCount -= item.cost
    count.textContent = totalClickCount

    let amount = 1

    // check if we already own item, if we do then ++ it, else add it
    const itemInArray = itemsOwned.find((obj) => obj.name === item.name)
    if (itemInArray) {
      itemInArray.amount++
      console.log(`Found ${item.name}, added 1!`)
      amount = itemInArray.amount
    } else {
      itemsOwned.push({ name: item.name, multiplier: item.multiplier, amount: 1 })
      console.log(`Added ${item.name} to itemsOwned!`)
    }

    // make the item cost more each time you buy it
    item.cost = item.startingCost + item.startingCost * amount ** 2
    createShopItems() // redraw the shop with new prices

    console.log(`Bought ${itemName}!`)
  } else {
    console.log(`Not enough clicks! Need ${item.cost}`)
  }
  createStats()
}

function createStats() {
  let itemsOwnedParagraph = ``
  statsContainer.innerHTML = `
  <p>Total click count: ${totalClickCount}</p>
  <p>Total multiplier count: ${multiplierCount ?? 1}</p>
  ${
    itemsOwned.forEach((item) => {
      itemsOwnedParagraph += `<p>Total <img src="${shopItems.find((shopItem) => shopItem.name === item.name).imagePath}" width="44"/> owned: ${item.amount}</p>`
    }) ?? ''
  }
  ${itemsOwnedParagraph}
  `
}

setInterval(() => {
  const dayCareWorkersOwned = itemsOwned.find((i) => i.name === 'Daycare Workers')
  if (dayCareWorkersOwned) {
    console.log(dayCareWorkersOwned)

    for (let i = 0; i < dayCareWorkersOwned.amount; i++) {
      buttonClick(itemsOwned.find((i) => i.name === 'Lucky egg') ?? 1)
    }
  }
}, 1000) // <-- This makes it run every 1000ms

createShopItems()
createStats()
