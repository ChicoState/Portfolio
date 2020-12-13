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

  test('Blank submit', ()=> {
    const wrapper = mount(<Login />);
    const btn = wrapper.find('.btn');
    expect(btn.length).toBe(1);
    btn.simulate('click');
    expect(wrapper.find('.invalid-feedback').first().text()).toBe('');
  });

  test('Invalid email submit', ()=> {
    const wrapper = mount(<Login />);
    const btn = wrapper.find('.btn');
    expect(btn.length).toBe(1);
    const input = wrapper.find('input').first();
    expect(input.length).toBe(1);
    input.simulate('change', {
      target: {name: 'email', value: 'bob12'}
    })
    wrapper.update();
    btn.simulate('click');
    expect(wrapper.find('.invalid-feedback').first().text()).toBe('');
  });
});