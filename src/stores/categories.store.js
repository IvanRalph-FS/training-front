import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/article-categories`;

export const useCategoriesStore = defineStore({
    id: 'categories',
    state: () => ({
        categories: {},
        category: {},
        allCategories: {}
    }),
    actions: {
        async create(category) {
            await fetchWrapper.post(`${baseUrl}`, category);
        },
        async getAll() {
            this.allCategories = { loading: true };
            try {
                this.allCategories = await fetchWrapper.get(`${baseUrl}/list-all`);
            } catch (error) {
                this.allCategories = { error };
            }
        },
        async getAllPaginated(page = 1) {
            this.categories = { loading: true };
            try {
                this.categories = await fetchWrapper.get(`${baseUrl}?page=${page}`);
            } catch (error) {
                this.categories = { error };
            }
        },
        async getById(id) {
            this.category = { loading: true };
            try {
                this.category = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.category = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            // add isDeleting prop to category being deleted
            this.categories.data.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove category from list after deleted
            this.categories.data = this.categories.data.filter(x => x.id !== id);
        }
    }
});
