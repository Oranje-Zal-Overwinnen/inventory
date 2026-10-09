# Inventarissysteem

Inventarissysteem voor het beheren van producten, gebouwd met Vue 3, Vite en Vue Router.
De applicatie gebruikt de Composition API en een eigen store die via `provide` / `inject` beschikbaar
wordt gesteld. Geen CSS gebruikt: de interface bestaat uitsluitend uit HTML.

## Gebruikte tools

| Tool        | Versie | Doel                                                                 |
| ----------- | ------ | -------------------------------------------------------------------- |
| Vue 3       | 3.5    | Componenten, Composition API, reactiviteit                           |
| Vite        | 8      | Development server en productiebuild                                 |
| Vue Router  | 5      | Routering tussen pagina's                                            |
| TypeScript  | 6      | Types voor de logica                                                 |
| Eigen store | -      | Single source of truth met `ref`, `computed` en `provide` / `inject` |

## Installatie

```sh
npm install
```

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run lint
```

## Projectstructuur

```
src/
  App.vue                        navigatie en RouterView
  main.ts                        app aanmaken, store providen, router gebruiken
  router/index.ts                router met web history
  router/routes.ts               route definities
  stores/inventory.ts            eigen Inventory-store
  components/ProductForm.vue     herbruikbaar formulier voor toevoegen en bewerken
  views/
    ProductOverviewView.vue      tabel met alle producten
    ProductAddView.vue           pagina om een product toe te voegen
    ProductEditView.vue          pagina om een product te bewerken
    OrderView.vue                bestellijst met producten onder het minimum
    NotFoundView.vue             fallback voor onbekende routes
```

## Store

De store wordt gemaakt met `createInventoryStore()` en in `main.ts` met
`app.provide(inventoryStoreKey, createInventoryStore())` aan de applicatie gegeven. Componenten halen
de store op met `useInventoryStore()` en destructureren wat ze nodig hebben, bijv.  
`const { products, lowStockProducts, addProduct } = useInventoryStore()`.

| Onderdeel | Naam                           | Betekenis                                                                      |
| --------- | ------------------------------ | ------------------------------------------------------------------------------ |
| state     | `products`                     | Lijst met 8 producten, elk met `id`, `name`, `actualAmount` en `minimumAmount` |
| getter    | `productCount`                 | Aantal producten in de inventaris                                              |
| getter    | `lowStockProducts`             | Producten waarbij `actualAmount < minimumAmount`                               |
| getter    | `lowStockCount`                | Aantal producten onder het minimum                                             |
| getter    | `nextId`                       | Eerstvolgende vrije product-id                                                 |
| getter    | `getProductById(id)`           | Zoekt een product op id                                                        |
| getter    | `isIdAvailable(id, currentId)` | Controleert of een id nog vrij is                                              |
| action    | `setActualAmount(id, amount)`  | Werkt het aanwezige aantal bij vanuit de tabel                                 |
| action    | `addProduct(input)`            | Voegt een product toe, geeft `false` bij een bezet id                          |
| action    | `updateProduct(id, input)`     | Past alle gegevens aan, geeft `false` bij een bezet id                         |

Alle velden van Inventory (`id`, `name`, `actualAmount`, `minimumAmount`) zijn via het
formulier aan te passen. De uniciteit van het id wordt op één plek bewaakt met `isIdAvailable`.

## Routes

| Pad                | Naam           | Component             |
| ------------------ | -------------- | --------------------- |
| `/`                | `overview`     | `ProductOverviewView` |
| `/toevoegen`       | `add-product`  | `ProductAddView`      |
| `/bewerken/:id`    | `edit-product` | `ProductEditView`     |
| `/bestellen`       | `order`        | `OrderView`           |
| `/:pathMatch(.*)*` | `not-found`    | `NotFoundView`        |

## Acceptatiecriteria

| User story | Onderdeel                                                 | Waar                                                                                  |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| INV-11244  | Vue 3 en Vite installatie                                 | `package.json`, `vite.config.ts`                                                      |
| INV-11244  | Vue Router implementatie                                  | `src/router/index.ts` en `src/router/routes.ts`                                       |
| INV-11244  | Eigen store                                               | `src/stores/inventory.ts`                                                             |
| INV-11244  | Composition API                                           | alle componenten gebruiken `script setup` met `ref`, `computed`, `watch` en `inject`  |
| INV-11245  | Inventory-store met id, name, actualAmount, minimumAmount | `InventoryProduct` en `products`                                                      |
| INV-11245  | Minimaal 7 producten met uniek id                         | 8 producten, `isIdAvailable` bewaakt de uniciteit                                     |
| INV-11246  | Tabel met alle producten uit de store                     | `ProductOverviewView.vue`                                                             |
| INV-11246  | Kolommen productnaam, aanwezig aantal, vereist aantal     | `ProductOverviewView.vue`                                                             |
| INV-11246  | Inputveld met `actualAmount` per product                  | `ProductOverviewView.vue`, action `setActualAmount`                                   |
| INV-11247  | Aparte toevoegpagina via router                           | `ProductAddView.vue`, route `add-product`                                             |
| INV-11247  | Herbruikbaar formuliercomponent                           | `ProductForm.vue`                                                                     |
| INV-11247  | Formulier gebaseerd op de Inventory-entiteit              | vier velden: id, naam, aanwezig, minimaal                                             |
| INV-11247  | Toevoegen- en annulerenknop                               | `ProductForm.vue` met `submitLabel` en `@cancel`                                      |
| INV-11248  | Bewerken-link per product                                 | `ProductOverviewView.vue`                                                             |
| INV-11248  | Vooraf ingevuld formulier                                 | `ProductEditView.vue` geeft het product uit de store als prop mee                     |
| INV-11248  | Alle productgegevens aanpasbaar                           | `ProductForm.vue` met alle vier de velden                                             |
| INV-11248  | Aanpassen- en annulerenknop                               | `ProductForm.vue`, `submitLabel` is "Aanpassen"                                       |
| INV-11249  | Knop naar bestelpagina                                    | `ProductOverviewView.vue`                                                             |
| INV-11249  | Lijst met producten onder het minimum                     | `OrderView.vue` met getter `lowStockProducts`                                         |
| INV-11250  | Flowchart van het weergeven van producten                 | `docs/flowchart.md`, `docs/flowchart-weergave.png`, `docs/flowchart-architectuur.png` |
