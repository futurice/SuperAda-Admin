import 'isomorphic-fetch';
import reduxApi, { transformers } from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import config from 'config';

import { showError } from '../modules/ErrorSnackbar';

export const MOVE_COMPANY_SHORTCIRCUIT = 'MOVE_COMPANY_SHORTCIRCUIT';

let store;

export const injectStore = (_store) => {
  store = _store;
}

// Endpoint configurations
const rest = reduxApi({
  auth: {
    url: `${config.API_ROOT}/admin/authenticate`,
    options: {
      method: 'POST'
    }
  },
  teams: {
    reducerName: 'teams',
    url: `${config.API_ROOT}/admin/teams`,
    transformer: transformers.array,
    crud: true,
  },
  team: {
    reducerName: 'teams',
    url: `${config.API_ROOT}/admin/teams/:teamId`,
    transformer: transformers.array,
    crud: true,
  },
  companies: {
    reducerName: 'companies',
    url: `${config.API_ROOT}/admin/companies`,
    transformer: transformers.array,
    crud: true,
    reducer(state, action) {
      if(action.type === MOVE_COMPANY_SHORTCIRCUIT) {
        var newState = Object.assign({}, state);
        if(newState.data !== undefined) {
          newState.data = newState.data.map((company, index) => {
            if(company.companyId === action.id) {
              company.positionX = action.x;
              company.positionY = action.y;
            }
            return company;
          })
        }
        return newState;
      }
      return state;
    }
  },
  company: {
    reducerName: 'companies',
    url: `${config.API_ROOT}/admin/companies/:companyId`,
    transformer: transformers.array,
    crud: true,
  },
  allFeedback: {
    reducerName: 'feedback',
    url: `${config.API_ROOT}/admin/feedback`,
    transformer: transformers.array,
    crud: true,
  },
  feedback: {
    reducerName: 'feedback',
    url: `${config.API_ROOT}/admin/feedback/:teamId`,
    transformer: transformers.array,
    crud: true,
  },
  // Add more API endpoints here! Examples below:

  /*
  // These example endpoints can be called by dispatching the respective actions, e.g:
  //
  // dispatch(rest.actions.teams.post({teamId: 42}, { body: JSON.stringify(exampleData) }));
  // Results in: POST /teams?teamId=42 with POST data from 'exampleData'
  //
  // Result of request can be found in: `state.teams.data`
  // Information about request: `state.teams.error`, `state.teams.sync`, `state.teams.error`...

  // Endpoints which return an array (data defaults to [])
  teams: {
    url: `${config.API_ROOT}/teams`,
    transformer: transformers.array,
    crud: true,
  },
  companies: {
    url: `${config.API_ROOT}/companies`,
    transformer: transformers.array,
    crud: true,
  }

  // Endpoint which returns an object (data defaults to {})
  profile: {
    url: `${config.API_ROOT}/profile`,
    crud: true,
  }
  */
})
.use('options', (url, params, getState) => {
  const { auth: { data: { token }}} = getState();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Add token to request headers
  if (token) {
    return { headers: {  ...headers, Authorization: `Bearer ${token}` } };
  }

  return { headers };
})
.use('fetch', adapterFetch(fetch))
.use('responseHandler', (err, data) => {
  if (err) {
    let msg = `Error`

    // error code
    msg += err.statusCode ? ` ${err.statusCode}` : ``

    // error reason
    msg += err.error ? ` ${err.error}` : ''

    // error description
    msg += err.message ? `: ${err.message}`: ''
    console.log(msg);
    store.dispatch(showError(msg))
  }
})

export default rest;
export const reducers = rest.reducers;
