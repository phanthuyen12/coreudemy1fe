import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="/assets/images/logo/logo.png" alt="Logo" className="mb-3" />
                  <h4>Welcome Back</h4>
                  <p className="text-muted">Sign in to your account</p>
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
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Sign In
                  </button>
                  
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <div className="text-center mt-3">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to="/sign-up" className="text-decoration-none">
                      Sign Up
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

export default SignIn;

