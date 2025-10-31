import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Create Account</h4>
                  <p className="text-muted">Sign up for a new account</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="fullName" 
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="terms" />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the <button type="button" className="btn btn-link text-decoration-none p-0">Terms and Conditions</button>
                    </label>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Sign Up
                  </button>
                  
                  <div className="text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/sign-in" className="text-decoration-none">
                      Sign In
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

export default SignUp;
