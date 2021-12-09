#include "stdafx.h"
#include <string>
#include <iostream>
#include "Winsock2.h" 
#pragma comment(lib, "WS2_32.lib") 
#include "Error.h"
#include <ctime>

#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS
#pragma warning(disable : 4996)


using namespace std;

int main()
{
	WSADATA wsaData;
	SOCKET sS;
	SOCKADDR_IN serv;

	serv.sin_family = AF_INET;
	serv.sin_port = htons(1521);
	serv.sin_addr.s_addr = inet_addr("192.168.56.2");


	SOCKET cS;
	SOCKADDR_IN clnt;
	memset(&clnt, 0, sizeof(clnt));
	int lclnt = sizeof(clnt);

	char ibuf[50];
	int libuf = 0;
	int lobuf = 0;
	int count = 0;

	clock_t start, stop;
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
		{
			throw SetErrorMsgText("Startup: ", WSAGetLastError());
		}
		while (true)
		{
			if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
			{
				throw SetErrorMsgText("socket: ", WSAGetLastError());
			}
			if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
			{
				throw SetErrorMsgText("bind: ", WSAGetLastError());
			}
			cout << "Server IP-address: " << inet_ntoa(serv.sin_addr) << endl;

			do
			{
				cout << "IP-address: " << inet_ntoa(clnt.sin_addr) << endl;

				start = clock();
				while (true)
				{
					if ((libuf = recvfrom(sS, ibuf, sizeof(ibuf), NULL, (sockaddr*)&clnt, &lclnt)) == SOCKET_ERROR)
					{
						throw SetErrorMsgText("recvfrom: ", WSAGetLastError());
					}
					if (strcmp(ibuf, "") == 0)
					{
						break;
					}
					char echo[50] = "ECHO:";
					char* obuf = strcat(echo,ibuf);
					if ((lobuf = sendto(sS, obuf, strlen(obuf), NULL, (sockaddr*)&clnt, sizeof(clnt))) == SOCKET_ERROR)
					{
						throw SetErrorMsgText("sendto: ", WSAGetLastError());
					}
				
					count++;
					cout << ibuf << endl;
				}
				stop = clock();
				cout << "Time for sendto and recvfrom: " << (double)((stop - start) / CLK_TCK) << endl;
				cout << "Messages: " << count << endl;
				count = 0;

			} while (true);

		}

		if (closesocket(sS) == SOCKET_ERROR)
		{
			throw SetErrorMsgText("closesocket: ", WSAGetLastError());
		}

		if (WSACleanup() == SOCKET_ERROR)
		{
			throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
		}
	}
	catch (string errorMsgText)
	{
		cout << endl << errorMsgText << endl;
	}

	system("pause");
	return 0;
}