import { computed, inject, ref, watch, type InjectionKey } from "vue";

export interface InventoryProduct {
    id: number;
    name: string;
    actualAmount: number;
    minimumAmount: number;
    price: number;
}

export type CreateProductInput = Omit<InventoryProduct, "id"> & { id?: number };

const STORAGE_KEY = "inventory_products";

const DEFAULT_PRODUCTS: InventoryProduct[] = [
    { id: 1, name: "Bloem 1 kg", actualAmount: 12, minimumAmount: 5, price: 1.19 },
    { id: 2, name: "Suiker 1 kg", actualAmount: 3, minimumAmount: 6, price: 1.49 },
    { id: 3, name: "Rijst 1 kg", actualAmount: 20, minimumAmount: 8, price: 2.29 },
    { id: 4, name: "Pasta 500 g", actualAmount: 4, minimumAmount: 10, price: 0.89 },
    { id: 5, name: "Olijfolie 1 l", actualAmount: 2, minimumAmount: 3, price: 7.99 },
    { id: 6, name: "Tomatenblik 400 g", actualAmount: 24, minimumAmount: 12, price: 0.79 },
    { id: 7, name: "Koffiebonen 1 kg", actualAmount: 1, minimumAmount: 4, price: 12.5 },
    { id: 8, name: "Melk 1 l", actualAmount: 6, minimumAmount: 6, price: 1.15 },
];

function loadStoredProducts(): InventoryProduct[] {
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((item, index) => {
                        const fallbackPrice = DEFAULT_PRODUCTS[index]?.price ?? 1.0;
                        return {
                            id: Number(item.id),
                            name: String(item.name || ""),
                            actualAmount: Number(item.actualAmount) || 0,
                            minimumAmount: Number(item.minimumAmount) || 0,
                            price: typeof item.price === "number" ? item.price : fallbackPrice,
                        };
                    });
                }
            }
        } catch {
            // Fallback naar de standaard data
        }
    }
    return DEFAULT_PRODUCTS;
}

export function createInventoryStore() {
    const products = ref<InventoryProduct[]>(loadStoredProducts());

    watch(
        products,
        (currentProducts) => {
            if (typeof window !== "undefined" && window.localStorage) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProducts));
                } catch {
                    // Negeer opslagfouten indien quota bereikt oid
                }
            }
        },
        { deep: true },
    );

    const productCount = computed(() => products.value.length);
    const lowStockProducts = computed(() =>
        products.value.filter((product) => product.actualAmount < product.minimumAmount),
    );
    const lowStockCount = computed(() => lowStockProducts.value.length);
    const totalOrderCost = computed(() =>
        lowStockProducts.value.reduce(
            (total, product) =>
                total + (product.minimumAmount - product.actualAmount) * product.price,
            0,
        ),
    );
    const nextId = computed(
        () => products.value.reduce((highest, product) => Math.max(highest, product.id), 0) + 1,
    );

    function getProductById(id: number): InventoryProduct | undefined {
        return products.value.find((product) => product.id === id);
    }

    function isIdAvailable(id: number, currentId?: number): boolean {
        return !products.value.some((product) => product.id === id && product.id !== currentId);
    }

    function addProduct(input: CreateProductInput): InventoryProduct {
        const id = input.id && input.id > 0 && isIdAvailable(input.id) ? input.id : nextId.value;
        const newProduct: InventoryProduct = {
            id,
            name: input.name,
            actualAmount: input.actualAmount,
            minimumAmount: input.minimumAmount,
            price: input.price,
        };
        products.value.push(newProduct);
        return newProduct;
    }

    function updateProduct(currentId: number, input: CreateProductInput): boolean {
        const product = getProductById(currentId);
        if (!product) {
            return false;
        }
        if (input.id && input.id !== currentId) {
            if (!isIdAvailable(input.id, currentId)) {
                return false;
            }
            product.id = input.id;
        }
        product.name = input.name;
        product.actualAmount = input.actualAmount;
        product.minimumAmount = input.minimumAmount;
        product.price = input.price;
        return true;
    }

    function deleteProduct(id: number): boolean {
        const index = products.value.findIndex((product) => product.id === id);
        if (index === -1) {
            return false;
        }
        products.value.splice(index, 1);
        return true;
    }

    function setActualAmount(id: number, value: number | string): number {
        const product = getProductById(id);
        const amount = Math.max(0, Math.floor(Number(value)) || 0);
        if (product) {
            product.actualAmount = amount;
        }
        return amount;
    }

    return {
        products,
        productCount,
        lowStockProducts,
        lowStockCount,
        totalOrderCost,
        nextId,
        getProductById,
        isIdAvailable,
        addProduct,
        updateProduct,
        deleteProduct,
        setActualAmount,
    };
}

export type InventoryStore = ReturnType<typeof createInventoryStore>;

export const inventoryStoreKey: InjectionKey<InventoryStore> = Symbol("inventoryStore");

export function useInventoryStore(): InventoryStore {
    const store = inject(inventoryStoreKey);
    if (!store) {
        throw new Error("De inventory store is niet beschikbaar");
    }
    return store;
}
