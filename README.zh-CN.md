# OpenIntent

**OpenIntent 是 agent web 的 intent layer。**

OpenIntent 是一个开放协议，用来让 agent 读懂、表达、匹配和解释 intent、capability、consent 与 match。

更直白地说：

- MCP 解决 agent 如何调用工具。
- A2A / ACP 解决 agent 如何彼此通信。
- OpenIntent 解决 agent 如何表达、理解、匹配和解释“想要什么”和“能提供什么”。

这就是 OpenIntent 要补上的语义层。

## 为什么要做

现在的 web 主要是给人看的。API 是给机器调用的。agent web 需要一种让 agent 能读懂的 intent 结构。

未来不是人一直手动搜索、筛选、联系、比较，而是 agent 代表人、组织、服务和软件，在开放网络里表达意图、发现能力、比较约束，并在需要时把关键决策交还给人类授权。

OpenIntent 要定义的不是一个平台，而是一套底层协议。

## 我们锁定的项目定位

项目名：

```text
OpenIntent
```

主句：

```text
OpenIntent is the intent layer for the agent web.
```

中文理解：

```text
OpenIntent 是 agent web 的意图层。
```

这里的 `agent web` 很重要。它不是单个 agent，也不是单个 bot，而是未来大量 agents、services、APIs、humans、organizations 在开放网络里互相发现、理解、匹配和协商的环境。

## v0.1 核心对象

OpenIntent v0.1 先定义四个对象：

- `IntentCard`：描述一个 actor 想要什么。
- `CapabilityCard`：描述一个 actor 能提供什么。
- `ConsentPolicy`：描述 agent 被允许做什么。
- `MatchReport`：解释一个 intent 和 capability 为什么匹配、部分匹配或不匹配。

这些核心对象内部会使用结构化语义片段，比如 `Constraint`、`Preference`、`MatchReason` 和 `MatchGap`。它们不是新的顶层协议对象，而是让四个核心对象更容易被 agent 读取、比较和解释。

我们会用 `intent / capability` 作为协议对象名，而不是 `demand / supply`。原因是前者更像开放协议，更 agent-native；后者更容易让项目看起来像 marketplace。

但在解释层面，OpenIntent 确实是在处理需求与供给。

## 最小闭环

v0.1 的最小闭环是：

1. 用户、项目、组织或 agent 创建一个 `IntentCard`。
2. 服务、专家、产品或 agent 暴露一个 `CapabilityCard`。
3. 本地 matcher 比较两者。
4. matcher 输出 `MatchReport`，解释为什么匹配或不匹配。
5. 如果要联系、转发、存储或代表用户行动，必须经过 `ConsentPolicy`。

第一阶段不做大平台。第一阶段要做的是协议、schema、validator、examples 和一个能跑通的最小 demo。

## OpenIntent 不是什么

OpenIntent 不是：

- agent framework
- marketplace
- search engine
- model provider
- hosted SaaS platform
- transport protocol

OpenIntent 是一个协议层。现有 agents、apps、websites、APIs、marketplaces 都可以采用它。

## 为什么这个项目有机会成为重要开源项目

优秀开发者会 star 一个项目，通常不是因为愿景宏大，而是因为它让他们马上能做一件以前很麻烦的事。

所以 OpenIntent 必须做到：

- 5 分钟跑起来本地验证。
- 10 分钟定义自己的 `CapabilityCard`。
- 15 分钟完成一次带解释的 match。
- 有 JSON Schema。
- 有 validator。
- 有 compliance tests。
- 有真实 examples。
- 有 MCP、A2A、ACP、OpenAPI 等生态的 adapter 路线。

项目气质必须是：协议清楚、边界漂亮、能组合、有 demo、有标准化野心、没有重 SaaS 味。

## 快速开始

运行测试：

```bash
npm test
```

验证示例：

```bash
npm run validate:examples
```

运行第一次 match：

```bash
npm run match:recruiting
```

这个命令会比较 `examples/recruiting/intent-card.json` 和 `examples/recruiting/capability-card.json`，并输出一个合法的 `MatchReport`。

验证自己的 card：

```bash
node packages/validator/src/cli.js path/to/card.json
```

## 示例

```json
{
  "type": "IntentCard",
  "version": "0.1",
  "id": "intent_recruiting_001",
  "actor": {
    "type": "project",
    "id": "https://github.com/openintent/openintent",
    "name": "OpenIntent"
  },
  "intent": {
    "summary": "Find a senior TypeScript contributor for an open protocol project",
    "category": "collaboration.recruiting",
    "constraints": [
      {
        "field": "experience",
        "operator": ">=",
        "value": 5,
        "unit": "years",
        "required": true
      }
    ],
    "preferences": [
      {
        "field": "open_source_contributions",
        "value": true,
        "weight": 0.8
      }
    ]
  },
  "consent": {
    "visibility": "public",
    "can_store": true,
    "can_forward": false,
    "can_contact_matches": false,
    "requires_human_approval": true
  }
}
```

## 当前状态

Experimental. v0.1 正在设计中。
