import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import AllGoogleMaps from './components/AllGoogleMaps';
import PageMetaData from '@/admin/components/PageTitle';
const GoogleMaps = () => {
  return <>
      <PageBreadcrumb subName="Maps" title="Google Maps" />
      <PageMetaData title="Google Maps" />
      <AllGoogleMaps />
    </>;
};
export default GoogleMaps;