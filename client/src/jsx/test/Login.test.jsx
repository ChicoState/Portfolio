import React from 'react';
import Login from './components/Login';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Login', () => {
  test('Render 2 input fields', () => {
    const wrapper = mount(<Login />);
    expect(wrapper.find('input').length).toBe(2);
  });
  test('init fields blank', () => {
    const wrapper = mount(<Login />);
    const emailInput = wrapper.find('input').first();
    const passwordInput = wrapper.find('input').at(1);
    expect(emailInput.props().value).toEqual('');
    expect(passwordInput.props().value).toEqual('');
  });
  test('blank form submit', ()=> {
    const wrapper = mount(<Login />);
    const btn = wrapper.find('.btn');
    expect(btn.length).toBe(1);
    btn.simulate('click');
    wrapper.update();
    expect(wrapper.find('.invalid-feedback').first().text()).toBe('Please enter a valid email');
  });
  test('form submit', ()=> {
    const wrapper = mount(<Login />);
    const emailInput = wrapper.find('input').first();
    const passwordInput = wrapper.find('input').at(1);
    emailInput.simulate('change', { target: { value: 'Hello@gmail.com' } })
    passwordInput.simulate('change', { target: { value: 'Hello' } })
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.find('.invalid-feedback').length).toBe(0);
  });

});