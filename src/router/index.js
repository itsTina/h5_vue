import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/components/Report'
import Case from '@/components/Case'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Order from '@/components/Order'
import OrderSuccess from '@/components/OrderSuccess'
import OrderFail from '@/components/OrderFail'
import MyOrder from '@/components/MyOrder'
import ForgotAccount from '@/components/ForgotAccount'
import Topic from '@/components/Topic'
import Record from '@/components/Record'
import Tips from '@/components/Tips'
import TopicInfo from '@/components/TopicInfo'
import My from '@/components/My'
import DownloadLayer from '@/components/DownloadLayer'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Order',
      component: Order
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    },
    {
      path: '/orderFail',
      name: 'OrderFail',
      component: OrderFail
    },
    {
      path: '/report',
      name: 'Report',
      component: Report
    },
   {
      path: '/case',
      name: 'Case',
      component: Case
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      component: MyOrder
    },
    {
      path: '/forgotAccount',
      name: 'ForgotAccount',
      component: ForgotAccount
    },
    {
      path: '/topic',
      name: 'Topic',
      component: Topic
    },
    {
      path: '/record',
      name: 'Record',
      component: Record
    },
    {
      path: '/tips',
      name: 'Tips',
      component: Tips
    },
    {
      path: '/topicInfo/:topicId',
      name: 'TopicInfo',
      component: TopicInfo
    },
    {
      path: '/my',
      name: 'My',
      component: My
    },
    {
      path: '/downloadLayer',
      name: 'DownloadLayer',
      component: DownloadLayer
    }
  ]
});

router.beforeEach((to, from, next) => {
  const { path } = to;

  _hmt.push(['_trackPageview', path]);
  
  next();
});

export default router;
