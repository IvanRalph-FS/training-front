import { Layout, List, AddEdit } from '@/views/categories';

export default {
    path: '/categories',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
