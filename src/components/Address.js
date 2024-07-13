import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toggleCartMenu } from "../actions/Cart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
function Address({ goBack }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    let user_address = {};
    localStorage.removeItem("user_address");
    let user_id = JSON.parse(localStorage.getItem("user"))?.id;
    if (user_id != undefined) {
      user_address["user_id"] = user_id;
    }
    user_address["address_1"] = data?.address_1;
    user_address["address_2"] = data?.address_2;
    user_address["email"] = data?.email;
    user_address["name"] = data?.name;
    user_address["phone"] = data?.phone;
    user_address["title"] = data?.title;
  };

  return (
    <section id="address">
      <div className="_item">
        <div className="_header">
          <h3>Add Address</h3>
          <p>MY PERSONAL DETAILS</p>
        </div>
        <div className="_body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="_formContainer">
              <div className="_column1">
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    {...register("name", { required: true })}
                    placeholder="Name"
                  />
                  <div className="text-danger">
                    {errors.name && <span>{errors?.name?.message}</span>}
                  </div>
                </div>
                <div className="form-grout _input">
                  <img
                    className="_overlayIcon"
                    src={process.env.PUBLIC_URL + "/imgs/uae.jpg"}
                  />
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    {...register("phone", {
                      required: true,
                      pattern: /^\+971-[56789]\d{8}$/i,
                    })}
                    name="phone"
                    defaultValue={"+971-567890123"}
                    placeholder="+971-567890123"
                  />
                  <div className="text-danger">
                    {errors.phone && (
                      <span>
                        This field is required & should be a valid phone number
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* style={{ marginTop: showCalendar ? '-2em' : '' }} */}
              <div className="_column2">
                <div className="form-group">
                  <input
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    })}
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                  <div className="text-danger">
                    {errors.email && <span>{errors?.email?.message}</span>}
                  </div>
                </div>
                {/* style={{ top: showCalendar ? '2em' : '' }} */}
              </div>
            </div>
            <div className="_addressDetail">
              <h3>Address Detail</h3>
              <div>
                <div className="_row _left">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      {...register("title", { required: true })}
                      placeholder="Address Title"
                    />
                    <div className="text-danger">
                      {errors.title && <span>{errors?.title?.message}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.address_1 ? "is-invalid" : ""
                      }`}
                      {...register("address_1", { required: true })}
                      placeholder="Street 2 Address"
                    />
                    <div className="text-danger">
                      {errors.address_1 && (
                        <span>{errors?.address_1?.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="_row _right">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.address_2 ? "is-invalid" : ""
                      }`}
                      {...register("address_2", { required: true })}
                      placeholder="Street 2 Address"
                    />
                    <div className="text-danger">
                      {errors.address_2 && (
                        <span>{errors?.address_2?.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="_row">
                  <div className="form-group _buttons">
                    <button type="button" className="_goBack" onClick={goBack}>
                      Go Back
                    </button>
                    <button type="submit" className="_submit">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Address;
