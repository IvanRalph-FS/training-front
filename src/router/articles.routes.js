import { Layout, List, AddEdit } from '@/views/articles';

export default {
    path: '/articles',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
