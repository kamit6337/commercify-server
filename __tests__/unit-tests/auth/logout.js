import logout from "../../../controllers/auth/general/logout.js";

let req, res, next;

beforeEach(() => {
  req = {};

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    clearCookie: jest.fn(),
  };

  next = jest.fn();
});

it("logout session successfully", async () => {
  logout(req, res, next);

  expect(res.clearCookie).toHaveBeenCalledWith("_use", expect.any(Object));
});
