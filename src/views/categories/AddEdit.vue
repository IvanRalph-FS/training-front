<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAlertStore } from '@/stores';
import { router } from '@/router';
import {useCategoriesStore} from "@/stores/categories.store";

const categoriesStore = useCategoriesStore()
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;

let title = 'Add Category';
let category = null;
if (id) {
    // edit mode
    title = 'Edit Category';
    ({ category } = storeToRefs(categoriesStore));
    categoriesStore.getById(id);
}

const schema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
});

async function onSubmit(values) {
    try {
        let message;
        if (category) {
            await categoriesStore.update(category.value.id, values)
            message = 'Category updated';
        } else {
            await categoriesStore.create(values);
            message = 'Category added';
        }
        await router.push('/categories');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(category?.loading || category?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="category" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>Name</label>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" />
                    <div class="invalid-feedback">{{ errors.name }}</div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/categories" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="category?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="category?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading category: {{category.error}}</div>
        </div>
    </template>
</template>
