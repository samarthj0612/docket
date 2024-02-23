#!/bin/bash

set -e
# set -x

PORT=6061
WIFI_IF=wlp3s0

ROOT_PKG="com.docket"
PKG="$ROOT_PKG"

if [[ $1 == "c" || $1 == "-c" || $2 == "c" || $2 == "-c" ]] ; then
  echo "Clearing data .."
  adb shell pm clear "$PKG"
fi

echo "PKG $PKG"

PREFS="<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?>
<map>
  <boolean name=\"js_dev_mode_debug\" value=\"true\" />
  <string name=\"sampling_profiler_sample_interval\">1000</string>
  <boolean name=\"start_sampling_profiler_on_init\" value=\"false\" />
  <string name=\"debug_http_host\">HOSTPORT</string>
  <boolean name=\"js_minify_debug\" value=\"false\" />
  <boolean name=\"animations_debug\" value=\"false\" />
  <boolean name=\"js_bundle_deltas_cpp\" value=\"false\" />
  <boolean name=\"js_bundle_deltas\" value=\"false\" />
  <boolean name=\"hot_module_replacement\" value=\"true\" />
</map>"

# Get the IP address and port
if ! USB_DEVICE=$(adb devices -l | grep 'usb:' | awk '{print $1}') ; then
  ADDR=$(ip addr show $WIFI_IF | grep -oP '(?<=inet\s)\d+(\.\d+){3}'):$PORT
else
  ADDR=""
  adb reverse tcp:$PORT tcp:$PORT || echo "Reverse TCP failed"
fi

PREFS=$(echo "$PREFS" | sed -e "s/HOSTPORT/$ADDR/g")

# Execute commands on the device
adb shell <<EOF
am force-stop "$PKG"
run-as "$PKG"
rm -rf index.js files/ReactNativeDevBundle.js files/language.realm*
mkdir -p shared_prefs
echo "$PREFS" > shared_prefs/"${PKG}_preferences.xml"
exit
am start -n "$PKG/$ROOT_PKG.MainActivity"
exit
EOF
