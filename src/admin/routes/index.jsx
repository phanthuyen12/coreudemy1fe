import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Dashboard Routes
const Analytics = lazy(() => import('@/admin/app/(admin)/dashboard/analytics/page'));
const Finance = lazy(() => import('@/admin/app/(admin)/dashboard/finance/page'));
const Sales = lazy(() => import('@/admin/app/(admin)/dashboard/sales/page'));
import '@/assets/scss/app.scss';

// Apps Routes
const EcommerceProducts = lazy(() => import('@/admin/app/(admin)/ecommerce/products/page'));
const EcommerceProductDetails = lazy(() => import('@/admin/app/(admin)/ecommerce/products/[productId]/page'));
const EcommerceProductCreate = lazy(() => import('@/admin/app/(admin)/ecommerce/products/create/page'));
const EcommerceCustomers = lazy(() => import('@/admin/app/(admin)/ecommerce/customers/page'));
const EcommerceSellers = lazy(() => import('@/admin/app/(admin)/ecommerce/sellers/page'));
const EcommerceOrders = lazy(() => import('@/admin/app/(admin)/ecommerce/orders/page'));
const EcommerceOrderDetails = lazy(() => import('@/admin/app/(admin)/ecommerce/orders/[orderId]/page'));
const EcommerceInventory = lazy(() => import('@/admin/app/(admin)/ecommerce/inventory/page'));
const Chat = lazy(() => import('@/admin/app/(admin)/apps/chat/page'));
const Email = lazy(() => import('@/admin/app/(admin)/apps/email/page'));
const Schedule = lazy(() => import('@/admin/app/(admin)/calendar/schedule/page'));
const Integration = lazy(() => import('@/admin/app/(admin)/calendar/integration/page'));
const Help = lazy(() => import('@/admin/app/(admin)/calendar/help/page'));
const Todo = lazy(() => import('@/admin/app/(admin)/apps/todo/page'));
const Social = lazy(() => import('@/admin/app/(admin)/apps/social/page'));
const Contacts = lazy(() => import('@/admin/app/(admin)/apps/contacts/page'));
const Invoices = lazy(() => import('@/admin/app/(admin)/invoices/page'));
const InvoiceDetails = lazy(() => import('@/admin/app/(admin)/invoices/[invoiceId]/page'));
const AdminBankingPage = lazy(()=> import('@/admin/app/(admin)/pages/banking/page'));
// Pages Routes
const Welcome = lazy(() => import('@/admin/app/(admin)/pages/welcome/page'));
const FAQs = lazy(() => import('@/admin/app/(admin)/pages/faqs/page'));
const Profile = lazy(() => import('@/admin/app/(admin)/pages/profile/page'));
const Tickets = lazy(() => import('@/admin/app/(admin)/pages/tickets/page'));
const ComingSoon = lazy(() => import('@/admin/app/(other)/coming-soon/page'));
const ContactUs = lazy(() => import('@/admin/app/(admin)/pages/contact-us/page'));
const AboutUs = lazy(() => import('@/admin/app/(admin)/pages/about-us/page'));
const OurTeam = lazy(() => import('@/admin/app/(admin)/pages/our-team/page'));
const TimelinePage = lazy(() => import('@/admin/app/(admin)/pages/timeline/page'));
const Pricing = lazy(() => import('@/admin/app/(admin)/pages/pricing/page'));
const Maintenance = lazy(() => import('@/admin/app/(other)/maintenance/page'));
const Widgets = lazy(() => import('@/admin/app/(admin)/widgets/page'));

// Base UI Routes
const Accordions = lazy(() => import('@/admin/app/(admin)/ui/accordions/page'));
const Alerts = lazy(() => import('@/admin/app/(admin)/ui/alerts/page'));
const Avatars = lazy(() => import('@/admin/app/(admin)/ui/avatars/page'));
const Badges = lazy(() => import('@/admin/app/(admin)/ui/badges/page'));
const Breadcrumb = lazy(() => import('@/admin/app/(admin)/ui/breadcrumb/page'));
const Buttons = lazy(() => import('@/admin/app/(admin)/ui/buttons/page'));
const Cards = lazy(() => import('@/admin/app/(admin)/ui/cards/page'));
const Carousel = lazy(() => import('@/admin/app/(admin)/ui/carousel/page'));
const Collapse = lazy(() => import('@/admin/app/(admin)/ui/collapse/page'));
const Dropdowns = lazy(() => import('@/admin/app/(admin)/ui/dropdowns/page'));
const ListGroup = lazy(() => import('@/admin/app/(admin)/ui/list-group/page'));
const Modals = lazy(() => import('@/admin/app/(admin)/ui/modals/page'));
const Tabs = lazy(() => import('@/admin/app/(admin)/ui/tabs/page'));
const Offcanvas = lazy(() => import('@/admin/app/(admin)/ui/offcanvas/page'));
const Pagination = lazy(() => import('@/admin/app/(admin)/ui/pagination/page'));
const Placeholders = lazy(() => import('@/admin/app/(admin)/ui/placeholders/page'));
const Popovers = lazy(() => import('@/admin/app/(admin)/ui/popovers/page'));
const Progress = lazy(() => import('@/admin/app/(admin)/ui/progress/page'));
const Spinners = lazy(() => import('@/admin/app/(admin)/ui/spinners/page'));
const Toasts = lazy(() => import('@/admin/app/(admin)/ui/toasts/page'));
const Tooltips = lazy(() => import('@/admin/app/(admin)/ui/tooltips/page'));

// Advanced UI Routes
const Ratings = lazy(() => import('@/admin/app/(admin)/advanced/ratings/page'));
const SweetAlerts = lazy(() => import('@/admin/app/(admin)/advanced/alert/page'));
const Swiper = lazy(() => import('@/admin/app/(admin)/advanced/swiper/page'));
const Scrollbar = lazy(() => import('@/admin/app/(admin)/advanced/scrollbar/page'));
const Toastify = lazy(() => import('@/admin/app/(admin)/advanced/toastify/page'));

// Charts and Maps Routes
const Area = lazy(() => import('@/admin/app/(admin)/charts/area/page'));
const Bar = lazy(() => import('@/admin/app/(admin)/charts/bar/page'));
const Bubble = lazy(() => import('@/admin/app/(admin)/charts/bubble/page'));
const Candlestick = lazy(() => import('@/admin/app/(admin)/charts/candlestick/page'));
const Column = lazy(() => import('@/admin/app/(admin)/charts/column/page'));
const Heatmap = lazy(() => import('@/admin/app/(admin)/charts/heatmap/page'));
const Line = lazy(() => import('@/admin/app/(admin)/charts/line/page'));
const Mixed = lazy(() => import('@/admin/app/(admin)/charts/mixed/page'));
const Timeline = lazy(() => import('@/admin/app/(admin)/charts/timeline/page'));
const Boxplot = lazy(() => import('@/admin/app/(admin)/charts/boxplot/page'));
const Treemap = lazy(() => import('@/admin/app/(admin)/charts/treemap/page'));
const Pie = lazy(() => import('@/admin/app/(admin)/charts/pie/page'));
const Radar = lazy(() => import('@/admin/app/(admin)/charts/radar/page'));
const RadialBar = lazy(() => import('@/admin/app/(admin)/charts/radial-bar/page'));
const Scatter = lazy(() => import('@/admin/app/(admin)/charts/scatter/page'));
const Polar = lazy(() => import('@/admin/app/(admin)/charts/polar/page'));
const GoogleMaps = lazy(() => import('@/admin/app/(admin)/maps/google/page'));
const VectorMaps = lazy(() => import('@/admin/app/(admin)/maps/vector/page'));

// Forms Routes
const Basic = lazy(() => import('@/admin/app/(admin)/forms/basic/page'));
const Checkbox = lazy(() => import('@/admin/app/(admin)/forms/checkbox/page'));
const Select = lazy(() => import('@/admin/app/(admin)/forms/select/page'));
const Clipboard = lazy(() => import('@/admin/app/(admin)/forms/clipboard/page'));
const FlatPicker = lazy(() => import('@/admin/app/(admin)/forms/flat-picker/page'));
const Validation = lazy(() => import('@/admin/app/(admin)/forms/validation/page'));
const Wizard = lazy(() => import('@/admin/app/(admin)/forms/wizard/page'));
const FileUploads = lazy(() => import('@/admin/app/(admin)/forms/file-uploads/page'));
const Editors = lazy(() => import('@/admin/app/(admin)/forms/editors/page'));
const InputMask = lazy(() => import('@/admin/app/(admin)/forms/input-mask/page'));
const Slider = lazy(() => import('@/admin/app/(admin)/forms/slider/page'));

// Form Routes
const BasicTable = lazy(() => import('@/admin/app/(admin)/tables/basic/page'));
const GridjsTable = lazy(() => import('@/admin/app/(admin)/tables/gridjs/page'));

// Icon Routes
const BoxIcons = lazy(() => import('@/admin/app/(admin)/icons/boxicons/page'));
const IconaMoonIcons = lazy(() => import('@/admin/app/(admin)/icons/iconamoon/page'));

// Not Found Routes
const NotFoundAdmin = lazy(() => import('@/admin/app/(admin)/not-found'));
const NotFound = lazy(() => import('@/admin/app/(other)/(error-pages)/error-404/page'));
const NotFound2 = lazy(() => import('@/admin/app/(other)/(error-pages)/error-404-2/page'));

// Auth Routes
const AuthSignIn = lazy(() => import('@/admin/app/(other)/auth/sign-in/page'));
const AuthSignIn2 = lazy(() => import('@/admin/app/(other)/auth/sign-in-2/page'));
const AuthSignUp = lazy(() => import('@/admin/app/(other)/auth/sign-up/page'));
const AuthSignUp2 = lazy(() => import('@/admin/app/(other)/auth/sign-up-2/page'));
const ResetPassword = lazy(() => import('@/admin/app/(other)/auth/reset-pass/page'));
const ResetPassword2 = lazy(() => import('@/admin/app/(other)/auth/reset-pass-2/page'));
const LockScreen = lazy(() => import('@/admin/app/(other)/auth/lock-screen/page'));
const LockScreen2 = lazy(() => import('@/admin/app/(other)/auth/lock-screen-2/page'));

// Route Arrays
const Members = lazy(() => import('@/admin/app/(admin)/pages/members/page'));
const MembersDetail = lazy(() => import('@/admin/app/(admin)/pages/members/[memberId]/page'));
const Courser = lazy(() => import('@/admin/app/(admin)/pages/courses/page'));
const VideoCategoriesPage = lazy(() => import('@/admin/app/(admin)/pages/video-categories/page'));
const CourseVideosPage = lazy(() => import('@/admin/app/(admin)/pages/course-videos/page'));  
const VideoDetailPage = lazy(() => import('@/admin/app/(admin)/pages/course-videos/[videoId]/page'));
const AdminTicketsPage = lazy(()=>import('@/admin/app/(admin)/pages/tickets/page'))
const AdminTicketDetailPage = lazy(()=>import('@/admin/app/(admin)/pages/tickets/[ticketId]/page'))
const EnrollmentPage = lazy(()=>import('@/admin/app/(admin)/pages/enrollments/page')) 

const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/dashboard" />
}, {
  path: '*',
  name: 'not-found',
  element: <NotFound />
}];
const generalRoutes = [{
  path: '/dashboard',
  name: 'Analytics',
  element: <Analytics />
},
{
  path: '/page/members',
  name: 'Members',
  element: <Members />
},
{
path: '/page/enrollments',
name: 'Enrollments',
element: <EnrollmentPage />
},
{
  path: '/page/courses',
  name: 'Courses',
  element: <Courser />
},
{
  path: '/page/video-categories',
  name: 'VideoCategories',
  element: <VideoCategoriesPage />
},
{
  path: '/page/videos',
  name: 'CourseVideos',
  element: <CourseVideosPage />
},
{
  path: '/page/videos/detail/:videoId',
  name: 'CourseVideos',
  element: <VideoDetailPage />

},
{
  path : '/page/ticket',
  name:'ticket',
  element: <AdminTicketsPage/>
},
{
  path : '/page/ticket/:ticketId',
  name:'ticket-detail',
  element: <AdminTicketDetailPage/>
},
{
  path: '/page/banking',
  name: 'banking',
  element: <AdminBankingPage />
},
{
  path: '/page/members/:memberId',
  name: 'MembersDetail',
  element: <MembersDetail />
},
{
  path: '/dashboard/finance',
  name: 'Finance',
  element: <Finance />
}, {
  path: '/dashboard/sales',
  name: 'Sales',
  element: <Sales />
}];
const appsRoutes = [{
  name: 'Products',
  path: '/ecommerce/products',
  element: <EcommerceProducts />
}, {
  name: 'Product Details',
  path: '/ecommerce/products/:productId',
  element: <EcommerceProductDetails />
}, {
  name: 'Create Product',
  path: '/ecommerce/products/create',
  element: <EcommerceProductCreate />
}, {
  name: 'Customers',
  path: '/ecommerce/customers',
  element: <EcommerceCustomers />
}, {
  name: 'Sellers',
  path: '/ecommerce/sellers',
  element: <EcommerceSellers />
}, {
  name: 'Orders',
  path: '/ecommerce/orders',
  element: <EcommerceOrders />
}, {
  name: 'Order Details',
  path: '/ecommerce/orders/:orderId',
  element: <EcommerceOrderDetails />
}, {
  name: 'Inventory',
  path: '/ecommerce/inventory',
  element: <EcommerceInventory />
}, {
  name: 'Chat',
  path: '/apps/chat',
  element: <Chat />
}, {
  name: 'Email',
  path: '/apps/email',
  element: <Email />
}, {
  name: 'Schedule',
  path: '/calendar/schedule',
  element: <Schedule />
}, {
  name: 'Integration',
  path: '/calendar/integration',
  element: <Integration />
}, {
  name: 'Help',
  path: '/calendar/help',
  element: <Help />
}, {
  name: 'Todo',
  path: '/apps/todo',
  element: <Todo />
}, {
  name: 'Social',
  path: '/apps/social',
  element: <Social />
}, {
  name: 'Contacts',
  path: '/apps/contacts',
  element: <Contacts />
}, {
  name: 'Invoices List',
  path: '/invoices',
  element: <Invoices />
}, {
  name: 'Invoices Details',
  path: '/invoices/:invoiceId',
  element: <InvoiceDetails />
}];
const customRoutes = [{
  name: 'Welcome',
  path: '/pages/welcome',
  element: <Welcome />
}, {
  name: 'FAQs',
  path: '/pages/faqs',
  element: <FAQs />
}, {
  name: 'Profile',
  path: '/pages/profile',
  element: <Profile />
}, {
  name: 'Tickets',
  path: '/pages/tickets',
  element: <Tickets />
}, {
  name: 'Contact Us',
  path: '/pages/contact-us',
  element: <ContactUs />
}, {
  name: 'About Us',
  path: '/pages/about-us',
  element: <AboutUs />
}, {
  name: 'Our Team',
  path: '/pages/our-team',
  element: <OurTeam />
}, {
  name: 'Timeline',
  path: '/pages/timeline',
  element: <TimelinePage />
}, {
  name: 'Pricing',
  path: '/pages/pricing',
  element: <Pricing />
}, {
  name: 'Error 404 Alt',
  path: '/pages/error-404-alt',
  element: <NotFoundAdmin />
}, {
  name: 'Widgets',
  path: '/widgets',
  element: <Widgets />
}];
const baseUIRoutes = [{
  name: 'Accordions',
  path: '/ui/accordions',
  element: <Accordions />
}, {
  name: 'Alerts',
  path: '/ui/alerts',
  element: <Alerts />
}, {
  name: 'Avatars',
  path: '/ui/avatars',
  element: <Avatars />
}, {
  name: 'Badges',
  path: '/ui/badges',
  element: <Badges />
}, {
  name: 'Breadcrumb',
  path: '/ui/breadcrumb',
  element: <Breadcrumb />
}, {
  name: 'Buttons',
  path: '/ui/buttons',
  element: <Buttons />
}, {
  name: 'Cards',
  path: '/ui/cards',
  element: <Cards />
}, {
  name: 'Carousel',
  path: '/ui/carousel',
  element: <Carousel />
}, {
  name: 'Collapse',
  path: '/ui/collapse',
  element: <Collapse />
}, {
  name: 'Dropdowns',
  path: '/ui/dropdowns',
  element: <Dropdowns />
}, {
  name: 'List Group',
  path: '/ui/list-group',
  element: <ListGroup />
}, {
  name: 'Modals',
  path: '/ui/modals',
  element: <Modals />
}, {
  name: 'Tabs',
  path: '/ui/tabs',
  element: <Tabs />
}, {
  name: 'Offcanvas',
  path: '/ui/offcanvas',
  element: <Offcanvas />
}, {
  name: 'Pagination',
  path: '/ui/pagination',
  element: <Pagination />
}, {
  name: 'Placeholders',
  path: '/ui/placeholders',
  element: <Placeholders />
}, {
  name: 'Popovers',
  path: '/ui/popovers',
  element: <Popovers />
}, {
  name: 'Progress',
  path: '/ui/progress',
  element: <Progress />
}, {
  name: 'Spinners',
  path: '/ui/spinners',
  element: <Spinners />
}, {
  name: 'Toasts',
  path: '/ui/toasts',
  element: <Toasts />
}, {
  name: 'Tooltips',
  path: '/ui/tooltips',
  element: <Tooltips />
}];
const advancedUIRoutes = [{
  name: 'Ratings',
  path: '/advanced/ratings',
  element: <Ratings />
}, {
  name: 'Sweet Alert',
  path: '/advanced/alert',
  element: <SweetAlerts />
}, {
  name: 'Swiper Slider',
  path: '/advanced/swiper',
  element: <Swiper />
}, {
  name: 'Scrollbar',
  path: '/advanced/scrollbar',
  element: <Scrollbar />
}, {
  name: 'Toastify',
  path: '/advanced/toastify',
  element: <Toastify />
}];
const chartsNMapsRoutes = [{
  name: 'Area',
  path: '/charts/area',
  element: <Area />
}, {
  name: 'Bar',
  path: '/charts/bar',
  element: <Bar />
}, {
  name: 'Bubble',
  path: '/charts/bubble',
  element: <Bubble />
}, {
  name: 'Candle Stick',
  path: '/charts/candlestick',
  element: <Candlestick />
}, {
  name: 'Column',
  path: '/charts/column',
  element: <Column />
}, {
  name: 'Heatmap',
  path: '/charts/heatmap',
  element: <Heatmap />
}, {
  name: 'Line',
  path: '/charts/line',
  element: <Line />
}, {
  name: 'Mixed',
  path: '/charts/mixed',
  element: <Mixed />
}, {
  name: 'Timeline',
  path: '/charts/timeline',
  element: <Timeline />
}, {
  name: 'Boxplot',
  path: '/charts/boxplot',
  element: <Boxplot />
}, {
  name: 'Treemap',
  path: '/charts/treemap',
  element: <Treemap />
}, {
  name: 'Pie',
  path: '/charts/pie',
  element: <Pie />
}, {
  name: 'Radar',
  path: '/charts/radar',
  element: <Radar />
}, {
  name: 'Radial Bar',
  path: '/charts/radial-bar',
  element: <RadialBar />
}, {
  name: 'Scatter',
  path: '/charts/scatter',
  element: <Scatter />
}, {
  name: 'Polar Area',
  path: '/charts/polar',
  element: <Polar />
}, {
  name: 'Google',
  path: '/maps/google',
  element: <GoogleMaps />
}, {
  name: 'Vector',
  path: '/maps/vector',
  element: <VectorMaps />
}];
const formsRoutes = [{
  name: 'Basic Elements',
  path: '/forms/basic',
  element: <Basic />
}, {
  name: 'Checkbox & Radio',
  path: '/forms/checkbox',
  element: <Checkbox />
}, {
  name: 'Choice Select',
  path: '/forms/select',
  element: <Select />
}, {
  name: 'Clipboard',
  path: '/forms/clipboard',
  element: <Clipboard />
}, {
  name: 'Flat Picker',
  path: '/forms/flat-picker',
  element: <FlatPicker />
}, {
  name: 'Validation',
  path: '/forms/validation',
  element: <Validation />
}, {
  name: 'Wizard',
  path: '/forms/wizard',
  element: <Wizard />
}, {
  name: 'File Uploads',
  path: '/forms/file-uploads',
  element: <FileUploads />
}, {
  name: 'Editors',
  path: '/forms/editors',
  element: <Editors />
}, {
  name: 'Input Mask',
  path: '/forms/input-mask',
  element: <InputMask />
}, {
  name: 'Slider',
  path: '/forms/slider',
  element: <Slider />
}];
const tableRoutes = [{
  name: 'Basic Tables',
  path: '/tables/basic',
  element: <BasicTable />
}, {
  name: 'Grid JS',
  path: '/tables/gridjs',
  element: <GridjsTable />
}];
const iconRoutes = [{
  name: 'Boxicons',
  path: '/icons/boxicons',
  element: <BoxIcons />
}, {
  name: 'IconaMoon',
  path: '/icons/iconamoon',
  element: <IconaMoonIcons />
}];
export const authRoutes = [{
  path: '/auth/sign-in',
  name: 'Sign In',
  element: <AuthSignIn />
}, {
  name: 'Sign In 2',
  path: '/auth/sign-in-2',
  element: <AuthSignIn2 />
}, {
  name: 'Sign Up',
  path: '/auth/sign-up',
  element: <AuthSignUp />
}, {
  name: 'Sign Up 2',
  path: '/auth/sign-up-2',
  element: <AuthSignUp2 />
}, {
  name: 'Reset Password',
  path: '/auth/reset-pass',
  element: <ResetPassword />
}, {
  name: 'Reset Password 2',
  path: '/auth/reset-pass-2',
  element: <ResetPassword2 />
}, {
  name: 'Lock Screen',
  path: '/auth/lock-screen',
  element: <LockScreen />
}, {
  name: 'Lock Screen 2',
  path: '/auth/lock-screen-2',
  element: <LockScreen2 />
}, {
  name: '404 Error',
  path: '/error-404',
  element: <NotFound />
}, {
  name: 'Maintenance',
  path: '/maintenance',
  element: <Maintenance />
}, {
  name: '404 Error 2',
  path: '/error-404-2',
  element: <NotFound2 />
}, {
  name: 'Coming Soon',
  path: '/coming-soon',
  element: <ComingSoon />
}];
export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...customRoutes, ...baseUIRoutes, ...advancedUIRoutes, ...chartsNMapsRoutes, ...formsRoutes, ...tableRoutes, ...iconRoutes, ...authRoutes];