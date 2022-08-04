<script setup>
import {ref} from "vue";
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useAlertStore } from '@/stores';
import { router } from '@/router';
import {useArticlesStore} from "@/stores/articles.store";
import {useCategoriesStore} from "@/stores/categories.store";

const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;

const editor = ClassicEditor;
const editorData = ref('');
const editorConfig = ref({});

let title = 'Add Article';
let article = null;
let allCategories = null;
({allCategories} = storeToRefs(categoriesStore));
categoriesStore.getAll();


if (id) {
    // edit mode
    title = 'Edit Article';
    ({ article } = storeToRefs(articlesStore));
    articlesStore.getById(id);
    editorData.value = article.contents;
}

const schema = Yup.object().shape({
    article_category_id: Yup.string()
        .required('Category is required'),
    title: Yup.string()
        .required('Title is required'),
    slug: Yup.string()
        .required('Slug is required'),
});

async function onSubmit(values) {
    try {
        let message;
        values.contents = editorData.value;
        values.image = values.image[0];
        console.log(values);
        if (article) {
            await articlesStore.update(article.value.id, values)
            message = 'Article updated';
        } else {
            await articlesStore.create(values);
            message = 'Article added';
        }
        await router.push('/articles');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(article?.loading || article?.error || allCategories?.loading)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="article" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>Title</label>
                    <Field name="title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }" />
                    <div class="invalid-feedback">{{ errors.title }}</div>
                </div>

                <div class="form-group col">
                    <label>Slug</label>
                    <Field name="slug" type="text" class="form-control" :class="{ 'is-invalid': errors.slug }" />
                    <div class="invalid-feedback">{{ errors.slug }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Image</label>
                    <Field name="image" type="file" class="form-control" :class="{ 'is-invalid': errors.image }" />
                    <div class="invalid-feedback">{{ errors.image }}</div>
                </div>

                <div class="form-group col">
                    <label>Category</label>
                    <Field class="form-control" name="article_category_id" as="select" :class="{ 'is-invalid': errors.article_category_id }">
                        <option value="">Select value</option>
                        <option v-for="category in allCategories.data" :value="category.id">{{ category.name }}</option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.article_category_id }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Content</label>
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                    <div class="invalid-feedback">{{ errors.contents }}</div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/articles" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="article?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="article?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading article: {{ article.error }}</div>
        </div>
    </template>
</template>
