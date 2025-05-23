/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  EventParams,
  EventsService,
  SubTopicEventRouter,
} from '@backstage/plugin-events-node';

/**
 * Subscribes to the generic `gitlab` topic
 * and publishes the events under the more concrete sub-topic
 * depending on the `$.event_name` field provided.
 *
 * @public
 */
export class GitlabEventRouter extends SubTopicEventRouter {
  constructor(options: { events: EventsService }) {
    super({
      events: options.events,
      topic: 'gitlab',
    });
  }

  protected getSubscriberId(): string {
    return 'GitlabEventRouter';
  }

  protected determineSubTopic(params: EventParams): string | undefined {
    if (
      'object_kind' in (params.eventPayload as object) ||
      'event_name' in (params.eventPayload as object)
    ) {
      const payload = params.eventPayload as {
        event_name?: string;
        object_kind?: string;
      };
      return payload.object_kind || payload.event_name;
    }

    return undefined;
  }
}
