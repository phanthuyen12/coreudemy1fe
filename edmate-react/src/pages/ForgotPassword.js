import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Forgot Password</h4>
                  <p className="text-muted">Enter your email to reset password</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Send Reset Link
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

export default ForgotPassword;

