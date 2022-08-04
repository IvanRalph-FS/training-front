<script setup>
import { storeToRefs } from 'pinia';
import {useRoute} from "vue-router";

import {useCategoriesStore} from "@/stores/categories.store";

const categoriesStore = useCategoriesStore();
const route = useRoute();
const { categories } = storeToRefs(categoriesStore);

categoriesStore.getAllPaginated(route.query.page ?? '');
</script>

<template>
    <h1>Categories</h1>
    <router-link to="/categories/add" class="btn btn-sm btn-success mb-2">Add Category</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">Category Name</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="categories.data?.length">
                <tr v-for="category in categories.data" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/categories/edit/${category.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="categoriesStore.delete(category.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="category.isDeleting">
                            <span v-if="category.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="categories.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="categories.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{categories.error}}</div>
                </td>
            </tr>
            <tr v-else>
                <td colspan="4">
                    <div>No data available</div>
                </td>
            </tr>
        </tbody>
    </table>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li v-if="categories.meta" v-for="link in categories?.meta.links" class="page-item"><a class="page-link" :href="link.url" v-html="link.label"></a></li>
        </ul>
    </nav>
</template>
