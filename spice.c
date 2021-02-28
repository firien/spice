#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "SpiceUsr.h"
#include "SpiceZpr.h"

napi_value load(napi_env env, napi_callback_info info) {
  const size_t argc_expected = 1;
  size_t argc = argc_expected;
  napi_value args[1];
  napi_status status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  size_t str_len;
  napi_get_value_string_utf8(env, args[0], NULL, 0, &str_len);
  char *str = malloc((str_len+1) * sizeof(char));
  napi_get_value_string_utf8(env, args[0], str, str_len+1, &str_len);
  furnsh_c(str);
  // free(str);
}

napi_value spkpos(napi_env env, napi_callback_info info) {
  SpiceDouble et;
  SpiceDouble state[6];
  SpiceDouble lt;

  SpiceDouble range;
  SpiceDouble ra;
  SpiceDouble dec;

  const size_t argc_expected = 2;
  size_t argc = argc_expected;
  napi_value args[2];
  napi_status status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  size_t str_len;
  napi_get_value_string_utf8(env, args[0], NULL, 0, &str_len);
  char *str = malloc((str_len+1) * sizeof(char));
  napi_get_value_string_utf8(env, args[0], str, str_len+1, &str_len);

  str2et_c(str, &et);

  size_t str_len2;
  napi_get_value_string_utf8(env, args[1], NULL, 0, &str_len2);
  char *str2 = malloc((str_len2+1) * sizeof(char));
  napi_get_value_string_utf8(env, args[1], str2, str_len2+1, &str_len2);

  spkpos_c(str2, et, "J2000", "NONE", "EARTH", state, &lt);
  recrad_c(state, &range, &ra, &dec);

  napi_value obj;
  napi_create_object(env, &obj);

  napi_value napi_ra;
  napi_create_double(env, ra, &napi_ra);
  napi_value napi_dec;
  napi_create_double(env, dec, &napi_dec);
  napi_set_named_property(env, obj, "ra", napi_ra);
  napi_set_named_property(env, obj, "dec", napi_dec);
  return obj;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;
  napi_value spkposFn;

  status = napi_create_function(env, NULL, 0, load, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "loadKernel", fn);
  if (status != napi_ok) return NULL;

  status = napi_create_function(env, NULL, 0, spkpos, NULL, &spkposFn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "spkpos", spkposFn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
