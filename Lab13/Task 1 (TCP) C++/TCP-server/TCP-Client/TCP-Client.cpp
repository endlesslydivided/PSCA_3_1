#include "stdafx.h"
using namespace std;

int main()
{
	setlocale(LC_CTYPE, "Russian");
	WSADATA wsaData;
	SOCKET cC;
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
		{
			throw SetErrorMsgText("Startup: ", WSAGetLastError());
		}
		if ((cC = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
		{
			throw SetErrorMsgText("Socket: ", WSAGetLastError());
		}
		//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

		SOCKADDR_IN serv;
		serv.sin_family = AF_INET;
		serv.sin_port = htons(CLIENT_PORT);
		serv.sin_addr.s_addr = inet_addr(SERVER_ADDRESS);
		if ((connect(cC, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("connect:", WSAGetLastError());
		}

		//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

		int libuf = 0, lobuf = 0;
		int count;
		cout << "Number of messages: ";
		cin >> count;
		for (int i = 0; i < count; i++)
		{
			char num[4];
			char ibuf[50], obuf[30] = "Hello from client ";
			_itoa(i, num, 10);
			strcat(obuf, num);

			if ((lobuf = send(cC, obuf, sizeof(obuf), NULL)) == SOCKET_ERROR)
			{
				throw  SetErrorMsgText("send:", WSAGetLastError());
			}

			if (libuf = (recv(cC, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR)
			{
				throw  SetErrorMsgText("recv:", WSAGetLastError());
			}
			std::cout << ibuf << std::endl;

		}
		if ((lobuf = send(cC, "", strlen("") + 1, NULL)) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("send:", WSAGetLastError());
		}

		//-----
		if (closesocket(cC) == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("Closesocket:", WSAGetLastError());
		}
		if (WSACleanup() == SOCKET_ERROR)
		{
			throw  SetErrorMsgText("Cleanup:", WSAGetLastError());
		}
	}

	catch (std::string errorMsgText)
	{
		std::cout << std::endl << "WSAGetLastError: " << errorMsgText << std::endl;
	}

	WSACleanup();
	system("pause");
	return 0;
}

