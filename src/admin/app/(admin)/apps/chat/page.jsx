import { Row } from 'react-bootstrap';
import PageMetaData from '@/admin/components/PageTitle';
import { ChatProvider } from '@/admin/context/useChatContext';
import ChatApp from './components/ChatApp';
const ChatPage = () => {
  return <>
      <PageMetaData title="Chat" />
      <Row className="g-1">
        <ChatProvider>
          <ChatApp />
        </ChatProvider>
      </Row>
    </>;
};
export default ChatPage;