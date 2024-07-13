import React, { useRef, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UseOnClickOutside from './useOnClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getParams, serverResponse } from '../helpers/Index';
import { resetPassword as resetPasswordAction } from '../actions/Authentication';
import { toast } from 'react-toastify';
import CloseIcon from "../assets/icons/close-circle.svg";

function ResetPasswordModal({ resetPassword, setResetPasswordModal }) {
    const ref = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authentication = useSelector(state => state.authentication);
    UseOnClickOutside(ref, () => setResetPasswordModal(false));
    const formSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password length should be at least 8 characters")
            .max(16, "Password cannot exceed more than 16 characters"),
        passwordConfirmation: Yup.string()
            .required("Confirm Password is required")
            .min(8, "Password length should be at least 8 characters")
            .max(16, "Password cannot exceed more than 16 characters")
            .oneOf([Yup.ref("password")], "Passwords do not match")
    });
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: yupResolver(formSchema) });

    const onSubmit = data => dispatch(resetPasswordAction(data));
    useEffect(() => {
        const isOpenResetModal = getParams("isOpenResetModal");
        const code = getParams("code");
        if (isOpenResetModal == "true") {
            setResetPasswordModal(true);
            setValue("code", code);
        }
        if (resetPassword == true) {
            const { status, response, data } = authentication?.payload;
            if (response?.status == 400 && status == undefined) {
                toast.error(response?.data?.error?.message);
            } else if (status == 200 && !response?.status) {
                toast.success("Password updated");
                setResetPasswordModal(false);
                navigate("/?isOpenLoginModal=true");
            }
        }
    }, [authentication]);
    return (
        <>
            <div ref={ref} id="registrationModal" className={resetPassword ? 'fadeIn' : 'fadeOut'} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='_header'>
                        <div>
                            <h4>Password Reset</h4>
                            <p>Create a strong password.</p>
                        </div>
                        {/* <div className='_close'>
                            <span className='fa fa-close' onClick={() => {
                                setResetPasswordModal(false);
                            }}></span>
                        </div> */}
                        <div className="_close">
                            <img
                                className="_cursor_pointer"
                                onClick={() => {
                                    setResetPasswordModal(false);
                                }}
                                src={CloseIcon}
                                alt="icons"
                            />
                        </div>
                    </div>

                    <div className='form-group'>
                        <input type='hidden' name='code'  {...register("code")} />
                        <input className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            {...register("password")} name="password" placeholder='New Password' />
                        <div className='text-danger'>
                            {errors.password?.message}
                        </div>
                    </div>

                    <div className='form-group'>
                        <input className={`form-control ${errors.passwordConfirmation ? "is-invalid" : ""}`}
                            {...register("passwordConfirmation")} type='password' name="passwordConfirmation" placeholder='Repeat Password' />
                        <div className='text-danger'>
                            {errors.passwordConfirmation?.message}
                        </div>
                    </div>
                    <Form.Group className="mb-3 _btnContainer">
                        <Button type='submit' variant="primary" className='_btnFlatCenter'>Submit</Button>
                    </Form.Group>
                </form>
            </div>
        </>
    )
}
export default ResetPasswordModal;
