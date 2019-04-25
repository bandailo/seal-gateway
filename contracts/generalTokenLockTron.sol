pragma solidity ^0.4.23;

interface Token {
  function transfer(address _to, uint256 _value) external returns (bool success);
  function balanceOf(address _owner) external pure returns (uint256 balance);
}

contract GeneralTokenLock {

  Token public token;
  uint public unlockTime;
  address public withdrawAddress;
  address public tokenAddress;

  constructor(address _withdrawAddress, uint _lockTime, address _tokenAddress) public {
    withdrawAddress = _withdrawAddress;
    unlockTime = block.timestamp + _lockTime;
    tokenAddress = _tokenAddress;
    token = Token(_tokenAddress);
  }

  function withdraw(uint _value) public returns (bool success) {
    require(msg.sender == withdrawAddress && block.timestamp > unlockTime);
    return token.transfer(msg.sender, _value);
  }

  function balanceOf() public view returns (uint value) {
    return token.balanceOf(address(this));
  }

}
