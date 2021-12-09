#pragma once
#include <string>
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib") //get WS2_32.dll
using namespace std;

//Create error message
string GetErrorMsgText(int code);

//Set error
string SetErrorMsgText(string msgText, int code);