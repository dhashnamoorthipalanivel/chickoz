import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import ProtectedRoute from "../components/ProtectedRoute";

// Dashboard
import Dashboard from '../pages/Dashboard/Index';
import FranchiseDashboard from '../pages/Dashboard/FranchiseDashboard';

// Apps
import BlogDetail from '../pages/Apps/BlogDetail';
import BlogGrid from '../pages/Apps/BlogGrid';
import BlogList from '../pages/Apps/BlogList';
import Calendar from '../pages/Apps/Calendar';
import Chat from '../pages/Apps/Chat';
import EmailInbox from '../pages/Apps/EmailInbox';
import EmailRead from '../pages/Apps/EmailRead';
import InvoiceList from '../pages/Apps/InvoiceList';
import InvoiceDetail from '../pages/Apps/InvoiceDetail';
import ContactsGrid from '../pages/Apps/ContactsGrid';
import ContactsList from '../pages/Apps/ContactsList';
import ContactsProfile from '../pages/Apps/ContactsProfile';

// Auth
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import RecoverPw from '../pages/Auth/RecoverPw';
import LockScreen from '../pages/Auth/LockScreen';
import Logout from '../pages/Auth/Logout';
import ConfirmMail from '../pages/Auth/ConfirmMail';
import EmailVerification from '../pages/Auth/EmailVerification';
import TwoStepVerification from '../pages/Auth/TwoStepVerification';

// UI Components
import Alerts from '../pages/UI/Alerts';
import Buttons from '../pages/UI/Buttons';
import Cards from '../pages/UI/Cards';
import Carousel from '../pages/UI/Carousel';
import Colors from '../pages/UI/Colors';
import Dropdowns from '../pages/UI/Dropdowns';
import General from '../pages/UI/General';
import Grid from '../pages/UI/Grid';
import Images from '../pages/UI/Images';
import Modals from '../pages/UI/Modals';
import Offcanvas from '../pages/UI/Offcanvas';
import Placeholders from '../pages/UI/Placeholders';
import ProgressBars from '../pages/UI/ProgressBars';
import TabsAccordions from '../pages/UI/TabsAccordions';
import Typography from '../pages/UI/Typography';
import { UIToasts, UIVideo, UIUtilities } from '../pages/UI/UIExtra';

// Forms
import FormElements from '../pages/Forms/FormElements';
import FormValidation from '../pages/Forms/FormValidation';
import FormAdvanced from '../pages/Forms/FormAdvanced';
import FormEditors from '../pages/Forms/FormEditors';
import FormUploads from '../pages/Forms/FormUploads';
import FormWizard from '../pages/Forms/FormWizard';
import FormMask from '../pages/Forms/FormMask';

// Tables
import TablesBasic from '../pages/Tables/TablesBasic';
import TablesDataTable from '../pages/Tables/TablesDataTable';
import TablesResponsive from '../pages/Tables/TablesResponsive';
import TablesEditable from '../pages/Tables/TablesEditable';

// Pages
import { PagesStarter, PagesTimeline, PagesFAQs, PagesPricing, PagesMaintenance, PagesComingSoon } from '../pages/Pages/PagesAll';

// Extended
import { ExtendedLightbox, ExtendedRangeSlider, ExtendedSweetAlert, ExtendedRating, ExtendedNotifications, ExtendedSessionTimeout } from '../pages/Extended/ExtendedAll';

// Charts
import { ChartsApex, ChartsEChart, ChartsChartjs, ChartsKnob, ChartsSparkline } from '../pages/Charts/ChartsAll';

// Icons
import { IconsBoxicons, IconsMaterialDesign, IconsDripicons, IconsFontAwesome } from '../pages/Icons/IconsAll';

// Custom Pages
import CustomList from '../pages/Custom/CustomList';
import CustomCreate from '../pages/Custom/CustomCreate';
import CustomEdit from '../pages/Custom/CustomEdit';

// Maps
import { MapsGoogle, MapsVector, MapsLeaflet } from '../pages/Maps/MapsAll';

// Master Module
import Unit from '../pages/Master/Unit';
import Tax from '../pages/Master/Tax/Tax';
import FoodCategory from '../pages/Master/FoodCategory';
import MenuItem from '../pages/Master/MenuItem/MenuItem';
import RawMaterial from '../pages/Master/RawMaterial';
import PaymentMode from '../pages/Master/PaymentMode/PaymentMode';
import OrderType from '../pages/Master/OrderType/OrderType';
import KitchenStation from '../pages/Master/KitchenStation';
import Franchise from '../pages/Master/Franchise/Franchise';
import FranchiseForm from '../pages/Master/Franchise/FranchiseForm';
import MenuItemForm from '../pages/Master/MenuItem/MenuItemForm';
import FranchiseMenuVisibility from '../pages/Master/MenuItem/FranchiseMenuVisibility';
import FranchiseMenuAvailability from '../pages/Master/MenuItem/FranchiseMenuAvailability';
import FranchiseMenuVisibilityForm from '../pages/Master/MenuItem/FranchiseMenuVisibilityForm';
import TaxForm from '../pages/Master/Tax/TaxForm';
import Vendor from '../pages/Master/Vendor';
import VendorForm from '../pages/Master/VendorForm';
import OrderTypeForm from '../pages/Master/OrderType/OrderTypeForm';
import PaymentModeForm from '../pages/Master/PaymentMode/PaymentModeForm';
import LeadSource from '../pages/Master/LeadSource/LeadSource';
import Document from '../pages/Master/Document/Document';
import LeadSourceForm from '../pages/Master/LeadSource/LeadSourceForm';
import DocumentForm from '../pages/Master/Document/DocumentForm';
import Package from '../pages/Master/Package/Package';
import PackageForm from '../pages/Master/Package/PackageForm';
import Material from '../pages/Master/Material/Material';
import MaterialForm from '../pages/Master/Material/MaterialForm';
import MasalaItems from '../pages/Master/MasalaItems/MasalaItems';
import MasalaItemsForm from '../pages/Master/MasalaItems/MasalaItemsForm';

// CRM
import Enquiry from '../pages/CRM/Enquiry/Enquiry';
import EnquiryForm from '../pages/CRM/Enquiry/EnquiryForm';
import Lead from '../pages/CRM/Lead/Lead';
import LeadWizardFrom from '../pages/CRM/Lead/LeadWizardForm';
import LeadView from '../pages/CRM/Lead/LeadView';

// Store
import Billing from '../pages/StoreManagement/Billing';
import Orders from '../pages/StoreManagement/Orders';
import OrdersView from '../pages/StoreManagement/OrdersView';

// Manufacture
import Kishok from '../pages/Manufacture/Kishok/Kishok';
import KishokWizardForm from '../pages/Manufacture/Kishok/KishokWizardForm';
import KishokView from '../pages/Manufacture/Kishok/KishokView';
import MasalaFranchiseRequest from '../pages/Manufacture/Masala/MasalaFranchiseRequest';
import MasalaAdminProcess from '../pages/Manufacture/Masala/MasalaAdminProcess';
import MasalaFranchiseRequestForm from '../pages/Manufacture/Masala/MasalaFranchiseRequestForm';
import MasalaAdminProcessView from '../pages/Manufacture/Masala/MasalaAdminProcessView';
import MasalaAdminProcessForm from '../pages/Manufacture/Masala/MasalaAdminProcessForm';
import MasalaFranchiseRequestView from '../pages/Manufacture/Masala/MasalaFranchiseRequestView';

// Subscription
import Subscription from '../pages/Subscription/Subscription';

// Reports
import AdminReport from '../pages/Reports/AdminReport';
import FranchiseReport from '../pages/Reports/FranchiseReport';

// Auth
import SetUpPassword from '../pages/Auth/SetUpPassword';
import ChangePassword from '../pages/Auth/ChangePassword';


// Full-page auth/error routes (no layout)
const Page404 = () => (
  <div className="account-pages my-5 pt-sm-5">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="text-center">
            <div style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--bs-primary)' }}>404</div>
            <h1 className="mt-2">Page Not Found</h1>
            <p className="text-muted">Sorry, the page you are looking for does not exist.</p>
            <a href="/" className="btn btn-primary mt-3">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page500 = () => (
  <div className="account-pages my-5 pt-sm-5">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="text-center">
            <div style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--bs-danger)' }}>500</div>
            <h1 className="mt-2">Internal Server Error</h1>
            <p className="text-muted">Something went wrong on our end. Please try again later.</p>
            <a href="/" className="btn btn-primary mt-3">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const W = ({ children }) => <MainLayout>{children}</MainLayout>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}

      <Route path="/" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<W><Dashboard /></W>} />
      <Route path="/franchise-dashboard" element={<W><FranchiseDashboard /></W>} />
      <Route path="/reports-admin" element={<W><AdminReport /></W>} />
      <Route path="/reports-franchise" element={<W><FranchiseReport /></W>} />
      <Route path="/layouts-horizontal" element={<W><Dashboard /></W>} />

      {/* Auth (no layout) */}
      <Route path="/auth-login" element={<Login />} />
      <Route path="/auth-setup-password" element={<SetUpPassword />} />
      <Route path="/auth-register" element={<Register />} />
      <Route path="/register" element={<Register />} />
      {/*  */}
      <Route path="/auth-recoverpw" element={<RecoverPw />} />
      <Route path="/auth-lock-screen" element={<LockScreen />} />
      <Route path="/auth-logout" element={<Logout />} />
      <Route path="/auth-confirm-mail" element={<ConfirmMail />} />
      <Route path="/auth-email-verification" element={<EmailVerification />} />
      <Route path="/auth-two-step-verification" element={<TwoStepVerification />} />
      <Route path='/auth-change-password' element={<ChangePassword />} />

      {/* Error Pages (no layout) */}
      <Route path="/pages-404" element={<Page404 />} />
      <Route path="/pages-500" element={<Page500 />} />

      {/* Pages with MainLayout (no sidebar) */}
      <Route path="/pages-comingsoon" element={<PagesComingSoon />} />
      <Route path="/pages-maintenance" element={<PagesMaintenance />} />

      {/* Apps */}
      <Route path="/apps-blog-detail" element={<W><BlogDetail /></W>} />
      <Route path="/apps-blog-grid" element={<W><BlogGrid /></W>} />
      <Route path="/apps-blog-list" element={<W><BlogList /></W>} />
      <Route path="/apps-calendar" element={<W><Calendar /></W>} />
      <Route path="/apps-chat" element={<W><Chat /></W>} />
      <Route path="/apps-email-inbox" element={<W><EmailInbox /></W>} />
      <Route path="/apps-email-read" element={<W><EmailRead /></W>} />
      <Route path="/apps-invoices-list" element={<W><InvoiceList /></W>} />
      <Route path="/apps-invoices-detail" element={<W><InvoiceDetail /></W>} />
      <Route path="/apps-contacts-grid" element={<W><ContactsGrid /></W>} />
      <Route path="/apps-contacts-list" element={<W><ContactsList /></W>} />
      <Route path="/apps-contacts-profile" element={<W><ContactsProfile /></W>} />

      {/* UI Components */}
      <Route path="/ui-alerts" element={<W><Alerts /></W>} />
      <Route path="/ui-buttons" element={<W><Buttons /></W>} />
      <Route path="/ui-cards" element={<W><Cards /></W>} />
      <Route path="/ui-carousel" element={<W><Carousel /></W>} />
      <Route path="/ui-colors" element={<W><Colors /></W>} />
      <Route path="/ui-dropdowns" element={<W><Dropdowns /></W>} />
      <Route path="/ui-general" element={<W><General /></W>} />
      <Route path="/ui-grid" element={<W><Grid /></W>} />
      <Route path="/ui-images" element={<W><Images /></W>} />
      <Route path="/ui-modals" element={<W><Modals /></W>} />
      <Route path="/ui-offcanvas" element={<W><Offcanvas /></W>} />
      <Route path="/ui-placeholders" element={<W><Placeholders /></W>} />
      <Route path="/ui-progressbars" element={<W><ProgressBars /></W>} />
      <Route path="/ui-tabs-accordions" element={<W><TabsAccordions /></W>} />
      <Route path="/ui-typography" element={<W><Typography /></W>} />
      <Route path="/ui-toasts" element={<W><UIToasts /></W>} />
      <Route path="/ui-video" element={<W><UIVideo /></W>} />
      <Route path="/ui-utilities" element={<W><UIUtilities /></W>} />

      {/* Forms */}
      <Route path="/form-elements" element={<W><FormElements /></W>} />
      <Route path="/form-validation" element={<W><FormValidation /></W>} />
      <Route path="/form-advanced" element={<W><FormAdvanced /></W>} />
      <Route path="/form-editors" element={<W><FormEditors /></W>} />
      <Route path="/form-uploads" element={<W><FormUploads /></W>} />
      <Route path="/form-wizard" element={<W><FormWizard /></W>} />
      <Route path="/form-mask" element={<W><FormMask /></W>} />

      {/* Tables */}
      <Route path="/tables-basic" element={<W><TablesBasic /></W>} />
      <Route path="/tables-datatable" element={<W><TablesDataTable /></W>} />
      <Route path="/tables-responsive" element={<W><TablesResponsive /></W>} />
      <Route path="/tables-editable" element={<W><TablesEditable /></W>} />

      {/* Pages */}
      <Route path="/pages-starter" element={<W><PagesStarter /></W>} />
      <Route path="/pages-timeline" element={<W><PagesTimeline /></W>} />
      <Route path="/pages-faqs" element={<W><PagesFAQs /></W>} />
      <Route path="/pages-pricing" element={<W><PagesPricing /></W>} />

      {/* Extended */}
      <Route path="/extended-lightbox" element={<W><ExtendedLightbox /></W>} />
      <Route path="/extended-rangeslider" element={<W><ExtendedRangeSlider /></W>} />
      <Route path="/extended-sweet-alert" element={<W><ExtendedSweetAlert /></W>} />
      <Route path="/extended-rating" element={<W><ExtendedRating /></W>} />
      <Route path="/extended-notifications" element={<W><ExtendedNotifications /></W>} />
      <Route path="/extended-session-timeout" element={<W><ExtendedSessionTimeout /></W>} />

      {/* Charts */}
      <Route path="/charts-apex" element={<W><ChartsApex /></W>} />
      <Route path="/charts-echart" element={<W><ChartsEChart /></W>} />
      <Route path="/charts-chartjs" element={<W><ChartsChartjs /></W>} />
      <Route path="/charts-knob" element={<W><ChartsKnob /></W>} />
      <Route path="/charts-sparkline" element={<W><ChartsSparkline /></W>} />

      {/* Icons */}
      <Route path="/icons-boxicons" element={<W><IconsBoxicons /></W>} />
      <Route path="/icons-materialdesign" element={<W><IconsMaterialDesign /></W>} />
      <Route path="/icons-dripicons" element={<W><IconsDripicons /></W>} />
      <Route path="/icons-fontawesome" element={<W><IconsFontAwesome /></W>} />

      {/* Custom Pages */}
      <Route path="/custom-list" element={<W><CustomList /></W>} />
      <Route path="/custom-create" element={<W><CustomCreate /></W>} />
      <Route path="/custom-edit" element={<W><CustomEdit /></W>} />

      {/* Maps */}
      <Route path="/maps-google" element={<W><MapsGoogle /></W>} />
      <Route path="/maps-vector" element={<W><MapsVector /></W>} />
      <Route path="/maps-leaflet" element={<W><MapsLeaflet /></W>} />

      {/* Catch-all */}
      <Route path="*" element={<Page404 />} />

      {/* CRM Module */}
      <Route
        path='/crm-enquiry'
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "super_admin"
            ]}
          >
            <W><Enquiry /></W>
          </ProtectedRoute>
        }
      />
      <Route
        path='/crm-lead'
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "super_admin"
            ]}
          >
            <W><Lead /></W>
          </ProtectedRoute>
        }
      />

      {/* CRM module form */}
      <Route path="/crm-enquiry/add" element={<W><EnquiryForm /></W>} />
      <Route path="/crm-enquiry/edit/:id" element={<W><EnquiryForm /></W>} />
      <Route path="/crm-lead/view/:id" element={<W><LeadView /></W>} />
      <Route path="/crm-lead/:id" element={<W><LeadWizardFrom /></W>} />

      {/* Subscription Management (admin only) */}
      <Route path="/subscription-management" element={
        <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
          <W><Subscription /></W>
        </ProtectedRoute>
      } />

      {/* Manufacture */}
      <Route path="/manufacture-kishok" element={
        <ProtectedRoute
          allowedRoles={[
            "admin",
            "super_admin"
          ]}
        >
          <W> <Kishok /></W>
        </ProtectedRoute>
      }
      />
      <Route path="/manufacture-kishok/edit/:id" element={<W><KishokWizardForm /></W>} />
      <Route path="/manufacture-kishok/view/:id" element={<W><KishokView /></W>} />
      <Route path="/manufacture-masala-franchise-request" element={<W><MasalaFranchiseRequest /></W>} />
      <Route path="/manufacture-masala-admin-process" element={<W><MasalaAdminProcess /></W>} />
      <Route path="/manufacture-masala-franchise-request/add" element={<W><MasalaFranchiseRequestForm /></W>} />
      <Route path="/manufacture-masala-franchise-request/edit/:id" element={<W><MasalaFranchiseRequestForm /></W>} />
      <Route path="/manufacture-masala-franchise-request/view/:id" element={<W><MasalaFranchiseRequestView /></W>} />
      <Route path="/manufacture-masala-admin-process/add" element={<W><MasalaAdminProcessForm /></W>} />
      <Route path="/manufacture-masala-admin-process/view/:id" element={<W><MasalaAdminProcessView /></W>} />

      {/* Store Management */}
      <Route path='/store-management-billing'
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "super_admin",
              "user",
              "franchise",
            ]}
          >
            <W> <Billing /></W>
          </ProtectedRoute>
        }
      />
      <Route path='/store-management-orders'
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "super_admin",
              "user",
              "franchise"
            ]}
          >
            <W> <Orders /></W>
          </ProtectedRoute>
        }
      />
      <Route path='/store-management-orders/view/:id' element={<W> <OrdersView /> </W>} />

      {/* Master Module */}
      <Route path='/master-franchise'
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <W><Franchise /></W>
          </ProtectedRoute>
        }
      />
      <Route path='/master-franchise/add' element={<W><FranchiseForm /></W>} />
      <Route path='/master-franchise/edit/:id' element={<W><FranchiseForm /></W>} />
      <Route path='/master-package' element={<W><Package /></W>} />
      <Route path='/master-tax' element={<W><Tax /></W>} />
      <Route path='/master-menu-item' element={<W><MenuItem /></W>} />
      <Route path='/master-franchise-menu-visibility' element={<W><FranchiseMenuVisibility /></W>} />
      <Route path='/master-franchise-menu-availability'
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin", "user", "franchise"]}>
            <W><FranchiseMenuAvailability /></W>
          </ProtectedRoute>
        }
      />
      <Route path='/master-masala-items' element={<W><MasalaItems /></W>} />
      <Route path='/master-payment-mode' element={<W><PaymentMode /></W>} />
      <Route path='/master-order-type' element={<W><OrderType /></W>} />
      <Route path='/master-lead-source' element={<W><LeadSource /></W>} />
      <Route path='/master-document' element={<W><Document /></W>} />
      <Route path='/master-material' element={<W><Material /></W>} />
      <Route path='/master-menu-item/add' element={<W><MenuItemForm /></W>} />
      <Route path='/master-menu-item/edit/:id' element={<W><MenuItemForm /></W>} />
      <Route path="/master-franchise-menu-visibility/edit/:id" element={<W><FranchiseMenuVisibilityForm /></W>} />
      <Route path="/master-tax/add" element={<W><TaxForm /></W>} />
      <Route path="/master-tax/edit/:id" element={<W><TaxForm /></W>} />

      <Route path='/master-vendor' element={<W><Vendor /></W>} />
      <Route path='/master-vendor/add' element={<W><VendorForm /></W>} />
      <Route path='/master-vendor/edit/:id' element={<W><VendorForm /></W>} />
      <Route path="/master-order-type/add" element={<W><OrderTypeForm /></W>} />
      <Route path="/master-order-type/edit/:id" element={<W><OrderTypeForm /></W>} />
      <Route path="/master-payment-mode/add" element={<W><PaymentModeForm /></W>} />
      <Route path="/master-payment-mode/edit/:id" element={<W><PaymentModeForm /></W>} />
      <Route path="/master-lead-source/add" element={<W><LeadSourceForm /></W>} />
      <Route path="/master-lead-source/edit/:id" element={<W><LeadSourceForm /></W>} />
      <Route path="/master-document/add" element={<W><DocumentForm /></W>} />
      <Route path="/master-document/edit/:id" element={<W><DocumentForm /></W>} />
      <Route path="/master-material/add" element={<W><MaterialForm /></W>} />
      <Route path="/master-material/edit/:id" element={<W><MaterialForm /></W>} />
      <Route path="/master-package/add" element={<W><PackageForm /></W>} />
      <Route path="/master-package/edit/:id" element={<W><PackageForm /></W>} />
      <Route path="/master-masala-items/add" element={<W><MasalaItemsForm /></W>} />
      <Route path="/master-masala-items/edit/:id" element={<W><MasalaItemsForm /></W>} />

    </Routes>
  );
};

export default AppRoutes;
