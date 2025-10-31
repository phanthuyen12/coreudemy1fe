import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Verify Email</h4>
                  <p className="text-muted">Please check your email and enter the verification code</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="verificationCode" 
                      placeholder="Enter verification code"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Verify Email
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

export default VerifyEmail;

