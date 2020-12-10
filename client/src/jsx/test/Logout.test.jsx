import React from 'react';
import Logout from './components/Logout';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, configure } from 'enzyme';
import { Spinner } from 'react-bootstrap';

configure({ adapter: new Adapter() });

describe('Logout', () => {
  test('show logout text', () => {
    const wrapper = mount(<Logout />);
    expect(
        wrapper.containsMatchingElement(
            <h1>Logging out...</h1>
        )
      ).toBeTruthy()
  });
  test('show Spinner', () => {
    const wrapper = mount(<Logout />);
    expect(
        wrapper.containsMatchingElement(
            <Spinner></Spinner>
        )
      ).toBeTruthy()
  });
});
