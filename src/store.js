import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useStore = create()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,

        setCurrentUser: (user) => {
          set(() => ({
            currentUser: user,
          }));
        },

        addToUsers: (newUser) => {
          set(() => ({
            users: [...get().users, newUser],
          }));
        },

        logoutCurrentUser: () => {
          set(() => ({
            currentUser: {},
          }));
        },

        addToOrderedItems: (newOrderedItem) => {
          set(() => ({
            orderedItems: [...get().orderedItems, newOrderedItem],
          }));
        },

        cart: [],

        addToCart: (newCartItem) => {
          let updatedCart = [];
          const index = get().cart.findIndex(
            (cartItem) => cartItem.id === newCartItem.id
          );
          if (index === -1) {
            updatedCart = [...get().cart, newCartItem];
          } else {
            updatedCart = [...get().cart];
            updatedCart[index].quantity += newCartItem.quantity;
          }

          set(() => ({
            cart: updatedCart,
          }));
        },

        deleteToCart: (cartItemSelected) => {
          set(() => ({
            cart: get().cart.filter(
              (carItem) => carItem.id !== cartItemSelected.id
            ),
          }));
        },

        clearCart: () => {
          set(() => ({
            cart: [],
          }));
        },

        changeQuantity: (cartItemSelected, quantity) => {
          let updatedCart = [];
          const index = get().cart.findIndex(
            (cartItem) => cartItem.id === cartItemSelected.id
          );
          updatedCart = [...get().cart];
          updatedCart[index].quantity = quantity;
          set(() => ({
            cart: updatedCart,
          }));
        },

        changeQuantitySavedItems: (savedItemSelected, quantity) => {
          let updatedSavedItems = [];
          const index = get().savedItems.findIndex(
            (savedItem) => savedItem.id === savedItemSelected.id
          );
          updatedSavedItems = [...get().savedItems];
          updatedSavedItems[index].quantity = quantity;
          set(() => ({
            savedItems: updatedSavedItems,
          }));
        },

        savedItems: [],

        addToSavedItems: (newSavedItem) => {
          set(() => ({
            savedItems: [...get().savedItems, newSavedItem],
          }));
        },

        deleteToSavedItems: (savedItemSelected) => {
          set(() => ({
            savedItems: get().savedItems.filter(
              (savedItem) => savedItem.id !== savedItemSelected.id
            ),
          }));
        },

        filteredProducts: [],

        setFilteredProducts: (word) => {
          set((state) => ({
            filteredProducts: state.products.filter(
              (product) =>
                product.name.toLowerCase().includes(word.toLowerCase()) ||
                product.brand.toLowerCase().includes(word.toLowerCase())
            ),
          }));
        },

        orderFilteredProductsByPrice: () => {
          set((state) => ({
            filteredProducts: [...state.filteredProducts].sort(
              (a, b) => b.price - a.price
            ),
          }));
        },

        orderFilteredProductsByBrand: () => {
          set((state) => ({
            filteredProducts: [...state.filteredProducts].sort((a, b) => {
              if (a.brand < b.brand) {
                return -1;
              } else if (a.brand > b.brand) {
                return 1;
              } else {
                return 0;
              }
            }),
          }));
        },
      }),
      { name: "ulima-shop-storage" }
    )
  )
);
