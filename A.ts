/* 
 * 매우 특별한 파일
 */
namespace A
{

}

var GetUserLocalizedTime = function (): Date {
    return new Date();
}

handlers["GetUserLocalizedTime"] = GetUserLocalizedTime;
