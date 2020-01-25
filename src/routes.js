import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AddCategory from "./pages/admin/categories/add-category";
import ListCategories from "./pages/admin/categories/list-categories";
import AddIdea from "./pages/ideas/add-idea";
import ListCategoriesIdeas from "./pages/ideas/list-categories-ideas";
import ListIdeasFromCategory from "./pages/ideas/list-ideas-from-category";

const sub = {
  admin: '/admin',
  ideas: '/ideas'
};

export default {

  /**
   * Public Routes
   */
  home: {
    path: '/',
    component: Home,
    exact: true
  },

  login: {
    path: '/login',
    component: Login
  },

  register: {
    path: '/register',
    component: Register
  },

  dashboard: {
    path: '/dashboard',
    component: Dashboard
  },

  ideas: {
    add: {
      path: sub.ideas+'/add',
      component: AddIdea
    },
    list: {
      path: sub.ideas,
      component: ListCategoriesIdeas,
      exact: true
    },
    listIdeas: {
      path: sub.ideas+'/:category_id',
      component: ListIdeasFromCategory
    }
  },

  /**
   * Administration Routes
   */
  admin: {
    categories: {
      add: {
        path: sub.admin+'/categories/add',
        component: AddCategory
      },
      list: {
        path: sub.admin+'/categories',
        component: ListCategories,
        exact: true
      },
    }
  }

};