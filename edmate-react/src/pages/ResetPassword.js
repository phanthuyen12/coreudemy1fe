import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Reset Password</h4>
                  <p className="text-muted">Enter your new password</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Reset Password
                  </button>
                  
                  <div className="text-center">
                    <Link to="/sign-in" className="text-decoration-none">
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

