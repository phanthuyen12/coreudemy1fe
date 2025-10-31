import React from 'react';
import { Link } from 'react-router-dom';

const TwoStepVerification = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Two Step Verification</h4>
                  <p className="text-muted">Enter the code sent to your phone</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="verificationCode" 
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Verify
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

export default TwoStepVerification;

