import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/articles`;

export const useArticlesStore = defineStore({
    id: 'articles',
    state: () => ({
        articles: {},
        article: {}
    }),
    actions: {
        async create(article) {
            await fetchWrapper.post(`${baseUrl}`, article, true);
        },
        async getAll(page = 1) {
            this.articles = { loading: true };
            try {
                this.articles = await fetchWrapper.get(`${baseUrl}?page=${page}`);
            } catch (error) {
                this.articles = { error };
            }
        },
        async getById(id) {
            this.article = { loading: true };
            try {
                this.article = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.article = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            // add isDeleting prop to article being deleted
            this.articles.data.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove article from list after deleted
            this.articles.data = this.articles.data.filter(x => x.id !== id);
        }
    }
});
