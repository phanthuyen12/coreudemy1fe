import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import AllWizard from './components/AllWizard';
const Wizard = () => {
  return <>
      <PageBreadcrumb subName="Form" title="Wizard" />
      <PageMetaData title="Wizard" />
      <AllWizard />
    </>;
};
export default Wizard;