import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center">
                    <h4 className="text-danger">Có lỗi xảy ra</h4>
                    <p className="text-muted">Vui lòng tải lại trang hoặc liên hệ quản trị viên.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      Tải lại trang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

