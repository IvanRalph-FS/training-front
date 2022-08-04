<script setup>
import { storeToRefs } from 'pinia';
import {useRoute} from "vue-router";

import {useArticlesStore} from "@/stores/articles.store";

const articlesStore = useArticlesStore();
const route = useRoute();
const { articles } = storeToRefs(articlesStore);

articlesStore.getAll(route.query.page ?? '');
</script>

<template>
    <h1>Articles</h1>
    <router-link to="/articles/add" class="btn btn-sm btn-success mb-2">Add Article</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">Title</th>
                <th style="width: 30%">Slug</th>
                <th style="width: 30%">Category</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="articles.data?.length">
                <tr v-for="article in articles.data" :key="article.id">
                    <td>{{ article.title }}</td>
                    <td>{{ article.slug }}</td>
                    <td>{{ article.article_category.name }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/articles/edit/${article.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="articlesStore.delete(article.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="article.isDeleting">
                            <span v-if="article.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="articles.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-else>
                <td colspan="4">
                    <div>No data available</div>
                </td>
            </tr>
            <tr v-if="articles.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{articles.error}}</div>
                </td>
            </tr>
        </tbody>
    </table>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li v-if="articles.meta" v-for="link in articles?.meta.links" class="page-item"><a class="page-link" :href="link.url" v-html="link.label"></a></li>
        </ul>
    </nav>
</template>
